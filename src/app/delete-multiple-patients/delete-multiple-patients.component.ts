import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-multiple-delete-patients',
  templateUrl: './delete-multiple-patients.component.html',
  styleUrls: ['./delete-multiple-patients.component.css']
})
export class DeleteMultiplePatientsComponent implements OnInit {
  patientService: PatientService;
  patient: Patient = new Patient();
  fields: Array<string> = [];

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

  deletePatientenZeile(){
    console.log("deleted..");
    this.patientService.deletePatient(this.patient).then((result) => {
      if (result == 204) {
        // TODO: What should happen here? This component will not survice the deletePatient call ...
      }
    });
  }

}
