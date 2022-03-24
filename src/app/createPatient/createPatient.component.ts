import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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
  @ViewChild("pseudonymSelection") pseudonymSelection!: MatSelect;

  dataControll = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  patientListPseudonyms: Promise<string[]>;

  patient:Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;

  constructor(patientService: PatientService,
    patientListService: PatientListService,
    private router: Router) {

    this.patientService = patientService;
    this.patientListService = patientListService;
    this.patientListPseudonyms=patientListService.getPatientListIdTypes();
  }

  createNewPatient () {
    console.log(this.pseudonymSelection);
    this.patientService.createPatient(this.patient, this.pseudonymSelection.value).then(patient => {
      this.router.navigate(["/idcard"], {state: {patient: patient[0]}}).then(success => {
        //TODO Pseudonym anzeigen in ID Card
        console.log("successfully navigated to idcard")
      }).catch(error => {
        console.log("Can't navigate to idcard because of error.")
        console.log(error)
      })
    });
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
    console.log("new Field");

  }

  sendBanner($event: any) {

  }
}

export class AddPatientFormularComponent {
}
