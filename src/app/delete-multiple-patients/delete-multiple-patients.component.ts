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
  patients: Array<Patient> = [];

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  ngOnInit(): void {
    this.patients = history.state.patients;
  }

  deletePatientenZeile(){
    console.log("deleted..");
    this.patients.forEach((patient) => {
      this.patientService.deletePatient(patient).then((result) => {
        if (result == 204) {
          // TODO: What should happen here? This component will not survice the deletePatient call ...
        }
      });
    })
  }

}
