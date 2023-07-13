import {Component, Input, ViewChild} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {PatientListService} from "../services/patient-list.service";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent {
  title="Patient einfügen";
  @Input() fields : Array<string> = [];
  @ViewChild("idTypesSelection") idTypesSelection!: MatSelect;

  idTypesFormControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  patient:Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;

  constructor(
    patientService: PatientService,
    patientListService: PatientListService,
    private router: Router
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    this.idTypesFormControl.setValue(patientListService.getMainIdType());
  }

  async createNewPatient () {
    console.log(this.idTypesSelection);
    let newId = await this.patientService.createPatient(this.patient, this.idTypesSelection.value);
    await this.router.navigate(["/idcard", newId.idType, newId.idString]);
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }
}
