import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Patient} from "../../model/patient";
import {PatientService} from "../../services/patient.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {PatientListService} from "../../services/patient-list.service";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import {
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipRow
} from "@angular/material/chips";
import {ErrorNotificationService} from "../../services/error-notification.service";
import {GlobalTitleService} from "../../services/global-title.service";
import {Observable, of, retry} from "rxjs";
import {concatMap, map, mergeMap, startWith} from "rxjs/operators";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MainzellisteError} from "../../model/mainzelliste-error.model";
import {ErrorMessages} from "../../error/error-messages";
import {UserAuthService} from "../../services/user-auth.service";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ConsentDialogComponent} from "../../consent/consent-dialog/consent-dialog.component";
import {Consent} from "../../consent/consent.model";
import {ConsentService} from "../../consent/consent.service";
import {Permission} from "../../model/permission";
import {Operation} from "../../model/tenant";
import {AsyncPipe, NgFor, NgIf, NgStyle} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FieldService} from "../../services/field.service";
import _moment from "moment/moment";
import {Field, FieldType, SemanticType} from "../../model/field";
import {SexFieldComponent} from "../fields/sex-field/sex-field.component";
import {TextFieldComponent} from "../fields/text-field/text-field.component";
import {DateFieldComponent} from "../fields/date-field/date-field.component";
import {ExternalPseudonymsComponent} from "../external-pseudonyms/external-pseudonyms.component";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/select";
import {HasPermissionDirective} from "../../shared/directives/has-permission.directive";
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MlTokenAuthService} from "../../services/ml-token-auth.service";

export interface IdTypSelection {
  idType: string,
  added: boolean,
  associated?: boolean
}

@Component({
    selector: 'app-create-patient',
    templateUrl: './create-patient.component.html',
    styleUrls: ['./create-patient.component.css'],
  imports: [FormsModule, NgIf, ExternalPseudonymsComponent, MatFormField,
    MatLabel, MatChipGrid, NgFor, MatChipRow, MatChipRemove, MatIcon, MatChipInput, MatAutocompleteTrigger,
    ReactiveFormsModule, MatError, MatAutocomplete, MatOption, HasPermissionDirective, MatButton,
    MatIconButton, MatTooltip, MatProgressSpinner, AsyncPipe, TranslatePipe, TextFieldComponent, SexFieldComponent, DateFieldComponent, NgStyle]
})
export class CreatePatientComponent implements OnInit {
  protected readonly Permission = Permission;
  protected readonly SemanticType = SemanticType;
  protected readonly FieldType = FieldType;

  @Input() fields: Array<string> = [];

  @ViewChild('chipList') chipList!: MatChipGrid;

  patient: Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;
  userAuthService : UserAuthService;
  consent?: Consent;
  private route = inject(ActivatedRoute);

  internalIdTypeSelection: IdTypSelection[] = [];
  /** selected chip data model */
  selectedInternalIdTypes: string[] = [];
  /** autocomplete data model */
  filteredInternalIdTypes: Observable<IdTypSelection[]> = of([]);
  chipListInputCtrl = new FormControl();
  public creatingInProgress: boolean = false;

  semanticFields: {[key: string]: Field};
  nonSemanticFields: Field[];
  localDateFormat: string;

  showConsentFieldGroup: boolean = false;
  split: boolean = this.route.snapshot.queryParams['split'] == 'true';

  constructor(
    public translate: TranslateService,
    public consentDialog: MatDialog,
    patientService: PatientService,
    patientListService: PatientListService,
    userAuthService : UserAuthService,
    private readonly mlTokenAuthService: MlTokenAuthService,
    public errorNotificationService: ErrorNotificationService,
    private router: Router,
    private titleService: GlobalTitleService,
    public tentativeDialog: MatDialog,
    public fieldService: FieldService,
    public consentService: ConsentService
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    this.userAuthService = userAuthService;
    this.semanticFields = fieldService.getSemanticFields();
    this.nonSemanticFields = this.fieldService.getFields().filter(f => !f.semantic || f.semantic == SemanticType.UNDEFINED)
    this.localDateFormat = _moment().localeData().longDateFormat('L');
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('createPatient.title'), false, "person_add_alt");
  }

  ngOnInit(): void {
    let internalIdTypes  = this.patientListService.getAllInternalIdTypes( "C");
    let mainIdType = this.patientListService.findDefaultIdType(internalIdTypes);
    this.selectedInternalIdTypes.push(mainIdType);

    this.internalIdTypeSelection = internalIdTypes
    .map(t => {
      return {idType: t, added: mainIdType == t}
    });

    this.filteredInternalIdTypes = this.chipListInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let searchValue = value;
        if (value == undefined)
          searchValue = "";
        else if (typeof searchValue !== "string")
          searchValue = value.idType
        return this.internalIdTypeSelection
        .filter(e => !e.added && e.idType.toLowerCase().includes(searchValue.toLowerCase()))
      }),
    );

    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })

    if(!this.mlTokenAuthService.isAuthenticated())
      this.consentService.getConsentTemplateCount().subscribe(c => this.showConsentFieldGroup = c > 0);
  }

  public hasField(semantic: SemanticType):boolean {
    return this.semanticFields[semantic.valueOf()] != undefined;
  }

  public hasAnyFields(semantics: SemanticType[]):boolean {
    return Object.entries(this.semanticFields).some(([k,v]) => semantics.some( s => s.valueOf() == k.valueOf()));
  }

  public getFieldName(semantic: SemanticType): string {
    return this.semanticFields[semantic.valueOf()].name;
  }

  createNewPatient(sureness: boolean) {
    this.errorNotificationService.clearMessages();
    //create patient
    this.creatingInProgress = true;
    of(this.patient).pipe(
      concatMap(p => this.patientService.createPatient(p, this.selectedInternalIdTypes, sureness, this.mlTokenAuthService.getTokenId('addPatient'))),
      retry({
        delay: e => {
              if (e instanceof MainzellisteError) {
                // handle session timeout
                if (e.errorMessage == ErrorMessages.ML_SESSION_NOT_FOUND)
                  return this.userAuthService.retryLogin(this.router.url)
                // handle tentative
                else if (e.errorMessage == ErrorMessages.CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH) {
                  this.openCreatePatientTentativeDialog();
                  // do not emit any value in order to send a complete notification on subscription
                  this.creatingInProgress = false;
                  return of();
                }
              }
              throw e;
            }
      }),
      mergeMap( newId => {
        if (this.consent !== undefined) {
          this.consent.patientId = newId;
          return this.consentService.addConsent(this.consent)
          .pipe(
            // create document reference
            mergeMap(c => {
              if((this.consent?.scanUrls?.size || 0) > 0)
                return this.consentService.createScansAndProvenance(this.consent, (c as fhir4.Consent).id || "")
              else
                return of(newId);
            }),
            map(c => newId)
          );
        } else
          return of(newId);
      })
    ).subscribe({
      next: newId => {
        this.creatingInProgress = false;
        // ignore if a redirect
        if(newId != undefined)
          this.router.navigate(["/idcard", newId.idType, newId.idString]).then()
      },
      error: e => {
        this.creatingInProgress = false;
        throw e;
      }
    })
  }

  selectedInternalIdType(event: MatAutocompleteSelectedEvent): void {
    this.addInternalIdType(event.option.value);
  }

  findAndAddInternalIdType($event: MatChipInputEvent): void {
    const value = ($event.value || '').trim();
    if (value) {
      this.addInternalIdType(value);
    }

    // Clear the input value
    $event.chipInput.clear();
  }

  private addInternalIdType(idType: string) {
    let idTypeSelection = this.findIdType(idType);
    if (idTypeSelection != undefined) {
      this.selectedInternalIdTypes.push(idTypeSelection.idType);
      idTypeSelection.added = true;
      this.chipListInputCtrl.setValue(null);
      this.chipList.errorState = false;
      this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

  getExternalIdTypes(permittedOperation: Operation): string[] {
    return this.patientListService.getIdGenerators(true, permittedOperation).map(g => g.idType);
  }

  removeInternalIdType(idType: string) {
    const value = (idType || '').trim();

    this.internalIdTypeSelection
    .filter(e => e.idType == value)
    .forEach(e => {
      e.added = false;
    })

    // remove id type from selected id types
    let index = this.selectedInternalIdTypes.findIndex(e => e == value);
    if (index > -1) {
      this.selectedInternalIdTypes.splice(index, 1);
      this.chipList.errorState = this.selectedInternalIdTypes.length == 0;
      this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

  private findIdType(idType: string): IdTypSelection | undefined {
    return this.internalIdTypeSelection.find(e => e.idType == idType && !e.added);
  }

  openCreatePatientTentativeDialog(): void {
    const dialogRef = this.tentativeDialog.open(CreatePatientTentativeDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.createNewPatient(true);
    });
  }

  disable(patientForm: NgForm): boolean {
    let emptyFields = !Object.keys(this.patient.fields).length;
    let emptyIds = !this.patient.ids.some(id => id.idString.length > 0);
    let isIdsValid = patientForm.form.get('externalIds')?.valid ?? true;
    return !emptyFields && !patientForm.form.valid || emptyFields && (emptyIds || !isIdsValid);
  }

  openConsentDialog() {
    this.consentDialog.open(ConsentDialogComponent, {
      width: '900px',
      disableClose: true,
      data: {
        consent: !this.consent? this.consent : this.consent.clone(),
        edit: this.consent != undefined,
        isSaveButton: true,
        updateConsentObservable: (consent: Consent) => of(consent)
      }
    })
    .afterClosed().subscribe(result => {
      if(result)
        this.consent = result?.dataModel;
    });
  }

  deleteConsent() {
    this.consent = undefined;
  }
}

@Component({
    selector: 'create-patient-tentative-dialog',
    templateUrl: 'create-patient-tentative-dialog.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, TranslatePipe]
})
export class CreatePatientTentativeDialog {
  constructor(
    public dialogRef: MatDialogRef<CreatePatientTentativeDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
