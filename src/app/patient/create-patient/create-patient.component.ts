import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Patient } from "../../model/patient";
import { PatientService } from "../../services/patient.service";
import { Router } from "@angular/router";
import { FormControl, NgForm } from "@angular/forms";
import { PatientListService } from "../../services/patient-list.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { ErrorNotificationService } from "../../services/error-notification.service";
import { GlobalTitleService } from "../../services/global-title.service";
import { Observable, of, retry } from "rxjs";
import { concatMap, map, mergeMap, startWith } from "rxjs/operators";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MainzellisteError } from "../../model/mainzelliste-error.model";
import { ErrorMessages } from "../../error/error-messages";
import { UserAuthService } from "../../services/user-auth.service";
import { TranslateService } from "@ngx-translate/core";
import { ConsentDialogComponent } from "../../consent/consent-dialog/consent-dialog.component";
import { Consent } from "../../consent/consent.model";
import { ConsentService } from "../../consent/consent.service";
import { Permission } from "../../model/permission";
import { Operation } from "../../model/tenant";
import { AppConfigService } from "src/app/app-config.service";

export interface IdTypSelection {
  idType: string;
  added: boolean;
  associated?: boolean;
}

@Component({
  selector: "app-create-patient",
  templateUrl: "./create-patient.component.html",
  styleUrls: ["./create-patient.component.css"],
})
export class CreatePatientComponent implements OnInit {
  public readonly Permission = Permission;
  @Input() fields: Array<string> = [];

  externalIdTypesFormControl = new FormControl("");
  @ViewChild("chipList") chipList!: MatChipList;

  patient: Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;
  userAuthService: UserAuthService;
  consent?: Consent;

  internalIdTypeSelection: IdTypSelection[] = [];
  /** selected chip data model */
  selectedInternalIdTypes: string[] = [];
  /** autocomplete data model */
  filteredInternalIdTypes: Observable<IdTypSelection[]> = of([]);
  chipListInputCtrl = new FormControl();
  chipListInputData: string = "";

  externalIdTypes: IdTypSelection[] = [];
  public creatingInProgress: boolean = false;

  constructor(
    public translate: TranslateService,
    public consentDialog: MatDialog,
    patientService: PatientService,
    patientListService: PatientListService,
    userAuthService: UserAuthService,
    public errorNotificationService: ErrorNotificationService,
    private router: Router,
    private titleService: GlobalTitleService,
    public tentativeDialog: MatDialog,
    public consentService: ConsentService,
    public appConfigService: AppConfigService,
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    this.userAuthService = userAuthService;
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(
      this.translate.instant("createPatient.request_personal_identifier"),
    );
  }

  ngOnInit(): void {
    let internalIdTypes = this.patientListService.getAllInternalIdTypes("C");
    let mainIdType = this.patientListService.findDefaultIdType(internalIdTypes);
    this.selectedInternalIdTypes.push(mainIdType);

    this.internalIdTypeSelection = internalIdTypes.map((t) => {
      return { idType: t, added: mainIdType == t };
    });

    this.filteredInternalIdTypes = this.chipListInputCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        let searchValue = value;
        if (value == undefined) searchValue = "";
        else if (typeof searchValue !== "string") searchValue = value.idType;
        return this.internalIdTypeSelection.filter(
          (e) =>
            !e.added &&
            e.idType.toLowerCase().includes(searchValue.toLowerCase()),
        );
      }),
    );

    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
  }

  createNewPatient(sureness: boolean) {
    this.errorNotificationService.clearMessages();
    //create patient
    this.creatingInProgress = true;
    of(this.patient)
      .pipe(
        concatMap((p) =>
          this.patientService.createPatient(
            p,
            this.selectedInternalIdTypes,
            sureness,
          ),
        ),
        retry({
          delay: (e) => {
            if (e instanceof MainzellisteError) {
              // handle session timeout
              if (e.errorMessage == ErrorMessages.ML_SESSION_NOT_FOUND)
                return this.userAuthService.retryLogin(this.router.url);
              // handle tentative
              else if (
                e.errorMessage ==
                ErrorMessages.CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH
              ) {
                this.openCreatePatientTentativeDialog();
                // do not emit any value in order to send a complete notification on subscription
                this.creatingInProgress = false;
                return of();
              }
              else if (
                e.errorMessage == ErrorMessages.CREATE_PATIENT_CONFLICT_IDAT
                || e.errorMessage == ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS
                || e.errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_FIELD
                || e.errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID
                || e.errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_DATE_1
                || e.errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_DATE_2
              ) {
                this.creatingInProgress = false;
                throw e;
              }
            }
            throw e;
          },
        }),
        mergeMap((newId) => {
          if (this.consent !== undefined) {
            this.consent.patientId = newId;
            return this.consentService.addConsent(this.consent).pipe(
              // create document reference
              mergeMap((c) => {
                if ((this.consent?.scanUrls?.size || 0) > 0)
                  return this.consentService.createScansAndProvenance(
                    this.consent,
                    (c as fhir4.Consent).id || "",
                  );
                else return of(newId);
              }),
              map((c) => newId),
            );
          } else return of(newId);
        }),
      )
      .subscribe((newId) => {
        this.creatingInProgress = false;
        this.router.navigate(["/idcard", newId.idType, newId.idString]).then();
      });
  }

  fieldsChanged(newFields: { [p: string]: any }) {
    this.patient.fields = newFields;
  }

  selectedInternalIdType(event: MatAutocompleteSelectedEvent): void {
    this.addInternalIdType(event.option.value);
  }

  findAndAddInternalIdType($event: MatChipInputEvent): void {
    const value = ($event.value || "").trim();
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
      this.chipListInputCtrl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    }
  }

  getExternalIdTypes(permittedOperation: Operation): string[] {
    return this.patientListService
      .getIdGenerators(true, permittedOperation)
      .map((g) => g.idType);
  }

  removeInternalIdType(idType: string) {
    const value = (idType || "").trim();

    this.internalIdTypeSelection
      .filter((e) => e.idType == value)
      .forEach((e) => {
        e.added = false;
      });

    // remove id type from selected id types
    let index = this.selectedInternalIdTypes.findIndex((e) => e == value);
    if (index > -1) {
      this.selectedInternalIdTypes.splice(index, 1);
      this.chipList.errorState = this.selectedInternalIdTypes.length == 0;
      this.chipListInputCtrl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    }
  }

  private findIdType(idType: string): IdTypSelection | undefined {
    return this.internalIdTypeSelection.find(
      (e) => e.idType == idType && !e.added,
    );
  }

  openCreatePatientTentativeDialog(): void {
    const dialogRef = this.tentativeDialog.open(CreatePatientTentativeDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.createNewPatient(true);
    });
  }

  disable(patientForm: NgForm): boolean {
    let emptyFields = !Object.keys(this.patient.fields).length;
    let emptyIds = !this.patient.ids.some((id) => id.idString.length > 0);
    let isIdsValid = patientForm.form.get("externalIds")?.valid ?? true;
    // consent is required & consent not set --> invalid
    let consentValid = this.appConfigService.getConsentRequired()
      ? this.consent !== undefined
      : true;
    return (
      (!emptyFields && !patientForm.form.valid) ||
      (emptyFields && (emptyIds || !isIdsValid)) ||
      !consentValid
    );
  }

  openConsentDialog() {
    this.consentDialog
      .open(ConsentDialogComponent, {
        width: "900px",
        disableClose: true,
        data: {
          consent: !this.consent ? this.consent : this.consent.clone(),
          edit: this.consent != undefined,
          isSaveButton: true,
          updateConsentObservable: (consent: Consent) => of(consent),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.consent = result?.dataModel;
      });
  }

  deleteConsent() {
    this.consent = undefined;
  }
}

@Component({
  selector: "create-patient-tentative-dialog",
  templateUrl: "create-patient-tentative-dialog.html",
})
export class CreatePatientTentativeDialog {
  constructor(public dialogRef: MatDialogRef<CreatePatientTentativeDialog>) {}

  cancel(): void {
    this.dialogRef.close();
  }
}
