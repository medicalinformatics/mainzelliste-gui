import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {PatientListService} from "../services/patient-list.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {ErrorNotificationService} from "../services/error-notification.service";
import {GlobalTitleService} from "../services/global-title.service";
import {from, Observable, of, throwError} from "rxjs";
import {catchError, concatMap, map, retry, retryWhen, startWith, takeWhile} from "rxjs/operators";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessages} from "../error/error-messages";
import {UserAuthService} from "../services/user-auth.service";
import {ConsentDialogComponent} from "../consent-dialog/consent-dialog.component";
import {ConsentService} from "../consent.service";
import {Consent} from "../model/consent";

export interface IdTypSelection {
  idType: string,
  added: boolean,
}

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent  implements OnInit {
  @Input() fields: Array<string> = [];

  externalIdTypesFormControl = new FormControl('');
  @ViewChild('chipList') chipList!: MatChipList;

  patient: Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;
  userAuthService : UserAuthService;
  consent?: Consent;

  internalIdTypes: IdTypSelection[] = [];
  /** selected chip data model */
  selectedInternalIdTypes: string[] = [];
  /** autocomplete data model */
  filteredInternalIdTypes: Observable<IdTypSelection[]> = of([]);
  chipListInputCtrl = new FormControl();
  chipListInputData: string = "";

  externalIdTypes: IdTypSelection[] = [];

  constructor(
    public consentDialog: MatDialog,
    patientService: PatientService,
    patientListService: PatientListService,
    userAuthService : UserAuthService,
    public errorNotificationService: ErrorNotificationService,
    private router: Router,
    private titleService: GlobalTitleService,
    public tentativeDialog: MatDialog,
    private consentService: ConsentService
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    this.userAuthService = userAuthService;
    this.titleService.setTitle("Personenidentifikator anfordern");
  }

  ngOnInit(): void {
    this.selectedInternalIdTypes.push(this.patientListService.getMainIdType());

    this.internalIdTypes = this.patientListService.getIdGenerators()
    .filter(g => !g.isExternal)
    .map(g => {
      return {idType: g.idType, added: this.patientListService.getMainIdType() == g.idType}
    });

    this.filteredInternalIdTypes = this.chipListInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let searchValue = value;
        if (value == undefined)
          searchValue = "";
        else if (typeof searchValue !== "string")
          searchValue = value.idType
        return this.internalIdTypes
        .filter(e => !e.added && e.idType.toLowerCase().includes(searchValue.toLowerCase()))
      }),
    );
  }

  createNewPatient(sureness: boolean) {
    this.errorNotificationService.clearMessages();
    //create patient
    of(this.patient).pipe(
      concatMap(p => this.patientService.createPatient(p, this.selectedInternalIdTypes, sureness)),
      catchError((e, caught) => {
        if (e instanceof MainzellisteError) {
          switch (e.errorMessage) {
            case ErrorMessages.CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH:
              this.openCreatePatientTentativeDialog();
              break;
            case ErrorMessages.ML_SESSION_NOT_FOUND:
              // first try to login again
              return from(this.userAuthService.retryLogin(this.router.url)).pipe(concatMap(() => throwError(e)))
          }
        }
        return caught;
      }),
      retry(1)
    ).toPromise().then(newId => {
        if(this.consent){
          this.consent.patientId = newId;
          this.consentService.addConsent(this.consent).then();
        }
      this.router.navigate(["/idcard", newId.idType, newId.idString]).then()
    }
    )
  }

  fieldsChanged(newFields: { [p: string]: any }) {
    this.patient.fields = newFields;
  }

  getExternalIdTypes(added: boolean): IdTypSelection[] {
    if (this.externalIdTypes.length == 0)
      //init.
      this.externalIdTypes = this.patientListService.getIdGenerators()
      .filter(g => g.isExternal)
      .map(g => {
        return {idType: g.idType, added: false}
      });
    return this.externalIdTypes.filter(g => g.added == added);
  }

  addExternalIdField() {
    //add external id to patient model
    this.patient.ids.push({idType: this.externalIdTypesFormControl.value.idType, idString: ''})
    this.externalIdTypesFormControl.value.added = true;
  }

  removeExternalIdField(idType: string) {
    this.externalIdTypes
    .filter(e => e.idType == idType)
    .forEach(e => {
      e.added = false;
    })

    // remove external id from model
    let index = this.patient.ids.findIndex(id => id.idType == idType);
    if (index > -1)
      this.patient.ids.splice(index, 1);
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
    $event.chipInput!.clear();
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

  removeInternalIdType(idType: string) {
    const value = (idType || '').trim();

    this.internalIdTypes
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
    return this.internalIdTypes.find(e => e.idType == idType && !e.added);
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

  openConsentDialog() {
    const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
      width: '900px',
      data: this.consent
    });

    dialogRef.afterClosed().subscribe(result => {
      this.consent = result;
    });
  }
}

@Component({
  selector: 'create-patient-tentative-dialog',
  templateUrl: 'create-patient-tentative-dialog.html',
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
