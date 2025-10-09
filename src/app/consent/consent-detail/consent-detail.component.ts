import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MAT_DATE_LOCALE, MatOption} from "@angular/material/core";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "../consent.model";
import _moment from "moment";
import {ControlContainer, NgForm, NgModel} from "@angular/forms";
import {Permission} from "../../model/permission";
import {Subscription} from "rxjs";
import {HttpEventType} from "@angular/common/http";
import {map} from "rxjs/operators";
import {AuthorizationService} from "../../services/authorization.service";
import {TranslateService} from "@ngx-translate/core";
import {getErrorMessageFrom} from "../../error/error-utils";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ConsentDetailComponent implements OnInit, AfterViewInit {

  @Input() readOnly: boolean = false;
  @Input() submitting: boolean = false;
  @Input() consent!: Consent;
  @Input() templates!: Map<string, string>;
  @Output() consentChange = new EventEmitter<Consent>();
  @Input() errorMessages: string[] = [];
  @Output() errorMessagesChange = new EventEmitter<string[]>();
  @ViewChild('templateSelection') templateSelection!: MatSelect;
  @ViewChild('canvasRef') canvasEl!: ElementRef<HTMLCanvasElement>;

  private signaturePad!: SignaturePad;
  signaturePadActive: boolean = false;
  consentLoaded: boolean = true;
  localDateFormat:string;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;
  uploadSubscription: Subscription | undefined = undefined;
  consentScans: Map<string,string> = new Map<string, string>();
  patientSignature: string[] = [];
  canvasEmpty: boolean = true;

  constructor(
      private readonly consentService: ConsentService,
      private readonly authorizationService: AuthorizationService,
      private readonly translate :TranslateService,
      @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    //TODO migrate to luxon
    _moment.locale(this._locale);
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  ngOnInit(): void {
    // fetch consent template map <id, title> from backend
    if(this.templates == null)
      this.consentService.getConsentTemplateTitleMap()
        .subscribe(r => this.templates = r);

    if (!this.consent?.id && !this.readOnly) {
      this.consentLoaded = false;
      //reset selection if no template selected
      if (this.templateSelection)
        this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }

    // load scans id and signature
    if(this.readOnly && this.authorizationService.hasPermission(Permission.READ_CONSENT_SCANS)){
      this.consentService.getConsentProvenance(this.consent.id + '/_history/' + this.consent.version || "").pipe(
        map(p => (p[0]?.entity ?? [])
          .filter(e => e.role == "source")
          .map(e => e.what.reference?.substring("DocumentReference/".length) || "")
        )
      ).subscribe(ids => ids.forEach(id => this.consentScans.set(id, id)));
      this.consentService.getConsentProvenance(this.consent.id + '/_history/' + this.consent.version || "").pipe(
        map(p => (p[0]?.signature ?? [])
          .filter(s => s.type.some(t => t.code == "1.2.840.10065.1.12.1.7"))
          .map(s => s.data || "")
        )
      ).subscribe(data => {
        console.log("test");
        console.log(data[0]);
        this.patientSignature.push(data[0]);
        console.log(this.patientSignature);
        this.loadSignature();
      });
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasEl.nativeElement;

    canvas.width = 700;
    canvas.height = 200;

    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: 'black',
      backgroundColor: 'white'
    });
    
    this.signaturePad.off();
    this.signaturePadActive = false;
  }

  initDataModel(consentTemplateId: MatSelectChange) {
    if(!this.readOnly) {
      this.consentService.getNewConsentDataModel(consentTemplateId.value || "0")
      .subscribe(consentDataModel => {
        this.consent = consentDataModel;
        // propagate change to parent component
        this.consentChange.emit(this.consent);
      });
    }
  }

  getConsentExpirationDate(): string {
    if(!this.consent.validityPeriod.validFrom?.isValid) {
      return ""
    } else if (!this.consent.validityPeriod.period) {
      // unlimited validity
      if (!this.consent.validityPeriod.validUntil) {
        return this.translate.instant('consentDetail.valid_unlimited');
      } else { // fixed date
        return this.consent.validityPeriod.validUntil?.toJSDate().toLocaleDateString() ?? "";
      }
    } else { // defined period
      return this.translate.instant('consentDetail.valid_until')
        + this.consent.validityPeriod.validUntil?.toJSDate().toLocaleDateString();
    }
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
            let fileUrl = event.body?.url;
            if(fileUrl == undefined)
              throw new Error("failed to upload File");
            this.consent.scanUrls.set( files[0].name, fileUrl);
          }
        },
        error: e => {
          this.errorMessages.push(getErrorMessageFrom(e, this.translate));
          this.errorMessagesChange.emit(this.errorMessages);
        },
        complete: () => {
        }
      })
    }
  }

  cancelUploadScan() {
    this.uploadSubscription?.unsubscribe();
    this.resetUploadScan();
  }

  resetUploadScan() {
    this.uploadProgress = 0;
    this.uploadInProgress = false;
    this.uploadSubscription = undefined;
  }

  deleteUploadedScan(fileName: string) {
    this.consent.scanUrls.delete(fileName);
    console.log("remove from backend not implemented yet");
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
        this.errorMessages.push(getErrorMessageFrom(e, this.translate));
        this.errorMessagesChange.emit(this.errorMessages);
      },
      complete: () => {
      }
    });
  }

  loadSignature() {
    if (this.patientSignature[0] != undefined && this.patientSignature[0] != "") {
      this.canvasEmpty = false;
      let imageData = 'data:image/png;base64,' + this.patientSignature[0];
      this.signaturePad.fromDataURL(imageData, {
        ratio: 1,
        width: 700,
        height: 200
      });
    }
  }

  load() {
    this.canvasEmpty = true;
    if (this.consent.signature != undefined && this.consent.signature != "") {
      this.canvasEmpty = false;
      let imageData = 'data:image/png;base64,' + this.consent.signature;
      this.signaturePad.fromDataURL(imageData, {
        ratio: 1,
        width: 700,
        height: 200
      });
    }
  }

  clear() {
    this.canvasEmpty = false;
    this.signaturePad.clear();
    this.signaturePad.on();
    this.signaturePadActive = true;
  }

  removeSignature() {
    this.canvasEmpty = true;
    this.signaturePad.clear();
    this.consent.signature = "";
  }

  cancel() {
    this.signaturePad.clear();
    this.signaturePad.off();
    this.signaturePadActive = false;
    this.load();
  }

  save() {
    if (this.signaturePad.isEmpty()) {
      alert(this.translate.instant('consentDetail.alert_signature_empty'));
    } else {
      const dataURL = this.signaturePad.toDataURL();
      let splitURL = dataURL.split(",");
      this.consent.signature = splitURL[1];

      this.signaturePad.off();
      this.signaturePadActive = false;
    }
  }

  displayError(field: NgModel) {
    return field.invalid && (field.dirty || field.touched) && field.errors?.invalidPeriodStartDate?.value;
  }

  dateChanged($event: MatDatepickerInputEvent<any, any>) {
    if (this.consent.validityPeriod.period && $event.value){
      console.log("changed" + $event.value.toISODate());
      this.consent.validityPeriod.validUntil = this.consentService.addPeriodToDate($event.value.toISODate(), this.consent.validityPeriod.period);
    }
  }
}
