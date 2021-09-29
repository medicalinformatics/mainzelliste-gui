import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";

@Component({
  selector: 'app-delete-patient',
  templateUrl: './delete-patient.component.html',
  styleUrls: ['./delete-patient.component.css']
})
export class DeletePatientComponent implements OnInit {
  patient: Patient = new Patient();
  fields: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

/*  deletePatientenZeile(){
    this.patientService.deletePatient(this.patient).then((result) => {
      if (result == 204) {
        // TODO: What should happen here? This component will not survice the deletePatient call ...
      }
    });
  }*/

}
