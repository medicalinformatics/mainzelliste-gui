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
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ConsentDetailComponent implements OnInit {

  @Input() edit: boolean = false;
  @Input() consent!: Consent;
  @Input() templates!: Map<string, string>;
  @Output() consentChange = new EventEmitter<Consent>();
  @ViewChild('templateSelection') templateSelection!: MatSelect;
  localDateFormat:string;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;
  uploadSubscription: Subscription | undefined = undefined;

  constructor(
      private consentService: ConsentService,
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
    if (!this.consent?.id && (!this.edit && this.templateSelection)) {
      this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }
  }

  initDataModel(consentTemplateId: MatSelectChange) {
    this.consentService.getNewConsentDataModel(consentTemplateId.value || "0")
    .subscribe( consentDataModel => {
      this.consent = consentDataModel;
      // propagate change to parent component
      this.consentChange.emit(this.consent)
    });
  }

  getConsentExpiration(): string {
    return this.consent.period == 0 ? " für einen unbegrenzten Zeit-Raum" :
      ` bis ${new Date((this.consent.validFrom?.toDate().getTime() || 0)
        + this.consent.period).toLocaleDateString()}`;
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
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        let base64 :string = reader.result != null ? (typeof reader.result === 'string' ? reader.result as string : new TextDecoder().decode(reader.result)) : ""
        this.uploadInProgress = true;
        this.uploadSubscription = this.consentService.uploadConsentScan(base64, files[0].name,
          this.consent.fhirResource?.patient?.identifier).pipe(
          finalize(() => {
            this.resetUploadScan();
          })
        ).subscribe(fhirResource => {
          let resourceId = (fhirResource as fhir4.DocumentReference).id
          if(resourceId == undefined)
            throw new Error("returned resource contains no id")
          this.consent.scans.set( resourceId, files[0].name);

          // if (event.type == HttpEventType.UploadProgress) {
          //   this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          // }
        })
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
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

  deleteUploadedScan(resourceId: string) {
    this.consent.scans.delete(resourceId);
    console.log("remove from backend not implemented yet")
  }
}

export function invalidPeriodEndDateValidator(consentPeriod: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value + consentPeriod< new Date().getTime() ? { invalidPeriodEndDate: { value: control.value } } : null;
  };
}
