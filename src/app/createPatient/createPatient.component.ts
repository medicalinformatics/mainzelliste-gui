import {Component, Input} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {PatientListService} from "../services/patient-list.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {ErrorNotificationService} from "../services/error-notification.service";
import {GlobalTitleService} from "../services/global-title.service";

export interface IdTypSelection {
  idType: string,
  added: boolean,
}

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent {
  @Input() fields: Array<string> = [];

  internalIdTypesFormControl = new FormControl('', Validators.required);
  externalIdTypesFormControl = new FormControl('');

  patient: Patient = new Patient();
  selectedIdTypes: string[] = [];
  patientService: PatientService;
  patientListService: PatientListService;

  internalIdTypes: IdTypSelection[] = [];
  externalIdTypes: IdTypSelection[] = [];

  constructor(
    patientService: PatientService,
    patientListService: PatientListService,
    public errorNotificationService: ErrorNotificationService,
    private router: Router,
    private titleService: GlobalTitleService
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    let mainIdType = patientListService.getMainIdType();
    this.internalIdTypesFormControl.setValue(mainIdType);
    this.selectedIdTypes.push(mainIdType);
    this.titleService.setTitle("Personenidentifikator anfordern");
  }

  createNewPatient() {
    this.errorNotificationService.clearMessages();
    //create patient
    this.patientService.createPatient(this.patient, this.selectedIdTypes)
    .then(newId => {
      console.log(newId);
      this.router.navigate(["/idcard", newId.idType, newId.idString]).then()
    })
  }

  fieldsChanged(newFields: { [p: string]: any }) {
    this.patient.fields = newFields;
  }

  getInternalIdTypes(added: boolean): IdTypSelection[] {
    if (this.internalIdTypes.length == 0) {
      //init.
      this.internalIdTypes = this.patientListService.getIdGenerators()
      .filter(g => !g.isExternal)
      .map(g => {
        return {idType: g.idType, added: this.patientListService.getMainIdType() == g.idType}
      });
    }

    return this.internalIdTypes.filter(g => g.added == added);
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
    this.internalIdTypesFormControl.setValue(null);
  }

  findAndAddInternalIdType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      let foundIdTypeSelection = this.internalIdTypes.find(e => e.idType == value && !e.added);
      if (foundIdTypeSelection) {
        this.addInternalIdType(foundIdTypeSelection);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  addInternalIdType(idTypeSelection: IdTypSelection) {
    this.selectedIdTypes.push(idTypeSelection.idType);
    idTypeSelection.added = true;
  }

  removeInternalIdType(idType: string) {
    const value = (idType || '').trim();

    this.internalIdTypes
    .filter(e => e.idType == value)
    .forEach(e => {
      e.added = false;
    })

    // remove id type from model
    let index = this.selectedIdTypes.findIndex(e => e == value);
    if (index > -1)
      this.selectedIdTypes.splice(index, 1);
  }
}
