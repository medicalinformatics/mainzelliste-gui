import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientFieldsComponent} from "../patient-fields/patient-fields.component";
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent implements OnInit {
  title="Patient einfügen";
  patient: Patient;
  /*tmpPatient=*/

/*  formData={
    Nachname: '',
    Geburtsname: '',
    Vorname: '',
    Geburtsdatum: '',
    Wohnort: '',
    PLZ: '',
    idType: '',
    idString: ''
  }*/

  constructor() {
    this.patient = new Patient();
  }

  ngOnInit(): void {
  }
/*
  createNewPatient () {
    this.patientService.createPatient(this.tmpPatient).then((result) => {
      if (result == 200) {
        this.tmpPatient = new Patient();
      }
    });
  }
*/
}
