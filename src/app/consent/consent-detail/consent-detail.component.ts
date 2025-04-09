import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MAT_DATE_LOCALE, MatOption} from "@angular/material/core";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "../consent.model";
import _moment from "moment";
import {
  AbstractControl,
  ControlContainer,
  NgForm,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import {Permission} from "../../model/permission";
import {Subscription} from "rxjs";
import {HttpEventType} from "@angular/common/http";
import {map} from "rxjs/operators";
import {AuthorizationService} from "../../services/authorization.service";
import {TranslateService} from "@ngx-translate/core";
import {getErrorMessageFrom} from "../../error/error-utils";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ConsentDetailComponent implements OnInit {

  @Input() readOnly: boolean = false;
  @Input() submitting: boolean = false;
  @Input() consent!: Consent;
  @Input() templates!: Map<string, string>;
  @Output() consentChange = new EventEmitter<Consent>();
  @Input() errorMessages: string[] = [];
  @Output() errorMessagesChange = new EventEmitter<string[]>();
  @ViewChild('templateSelection') templateSelection!: MatSelect;
  localDateFormat:string;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;
  uploadSubscription: Subscription | undefined = undefined;
  consentScans: Map<string,string> = new Map<string, string>();

  constructor(
      private consentService: ConsentService,
      private authorizationService: AuthorizationService,
      private translate :TranslateService,
      @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    _moment.locale(this._locale);
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  ngOnInit(): void {
    // fetch consent template map <id, title> from backend
    if(this.templates == null)
      this.consentService.getConsentTemplateTitleMap()
        .subscribe(r => this.templates = r);

    //reset selection if no template selected
    if (!this.consent?.id && (!this.readOnly && this.templateSelection)) {
      this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }

    // load scans id
    if(this.readOnly && this.authorizationService.hasPermission(Permission.READ_CONSENT_SCANS)){
      this.consentService.getConsentProvenance(this.consent.id + '/_history/' + this.consent.version || "").pipe(
        map(p => (p[0]?.entity ?? [])
          .filter(e => e.role == "source")
          .map(e => e.what.reference?.substring("DocumentReference/".length) || "")
        )
      ).subscribe(ids => ids.forEach(id => this.consentScans.set(id, id)))
    }
  }

  initDataModel(consentTemplateId: MatSelectChange) {
    if(!this.readOnly) {
      this.consentService.getNewConsentDataModel(consentTemplateId.value || "0")
      .subscribe(consentDataModel => {
        this.consent = consentDataModel;
        // propagate change to parent component
        this.consentChange.emit(this.consent)
      });
    }
  }

  getConsentExpiration(): string {
    return this.consent.period == 0 ?
      this.translate.instant('consentDetail.valid_unlimited') :
      this.translate.instant('consentDetail.valid_until')
      + new Date((this.consent.validFrom?.toDate().getTime() || 0)
        + this.consent.period).toLocaleDateString();
  }

  /** Utils Method **/

  getTypeOf(item: ConsentItem): string {
    if (item === null) {
      return "null";
    } else if (item instanceof ConsentDisplayItem) {
      return 'ConsentDisplayItem';
    } else if (item instanceof ConsentChoiceItem) {
      return 'ConsentChoiceItem';
    }
    return '';
  }

  toChoiceItem(item: ConsentItem): ConsentChoiceItem {
    return item as ConsentChoiceItem;
  }

  getCurrentTemplateId() {
    return this.consent?.templateId;
  }

  protected readonly Permission = Permission;

  onScansSelected($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files as FileList;
    if(files != null && files.length >0) {
      this.uploadInProgress = true;
      this.uploadSubscription = this.consentService.uploadConsentScanFile(files[0], () => this.resetUploadScan()).subscribe({
        next: event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / (event.total ?? 1)));
          } else if(event.type == HttpEventType.Response) {
            let fileUrl = event.body?.url
            if(fileUrl == undefined)
              throw new Error("failed to upload File")
            this.consent.scanUrls.set( files[0].name, fileUrl);
          }
        },
        error: e => {
          this.errorMessages.push(getErrorMessageFrom(e, this.translate))
          this.errorMessagesChange.emit(this.errorMessages);
        },
        complete: () => {
        }
      })
    }
  }

  cancelUploadScan() {
    this.uploadSubscription?.unsubscribe()
    this.resetUploadScan();
  }

  resetUploadScan() {
    this.uploadProgress = 0;
    this.uploadInProgress = false;
    this.uploadSubscription = undefined;
  }

  deleteUploadedScan(fileName: string) {
    this.consent.scanUrls.delete(fileName);
    console.log("remove from backend not implemented yet")
  }

  downloadScan(id: string) {
    this.consentService.getConsentScan(id).subscribe({
      next: doc => {
        const downloadLink = document.createElement('a');
        downloadLink.href = "data:application/pdf;base64," + doc.content[0].attachment.data;
        downloadLink.download = id + ".pdf";
        downloadLink.click();
      },
      error: e => {
        this.errorMessages.push(getErrorMessageFrom(e, this.translate))
        this.errorMessagesChange.emit(this.errorMessages);
      },
      complete: () => {
      }
    });
  }
}

export function invalidPeriodEndDateValidator(consentPeriod: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value + consentPeriod< new Date().getTime() ? { invalidPeriodEndDate: { value: control.value } } : null;
  };
}
