import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {PatientListService} from "../services/patient-list.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-multiple-delete-patients',
  templateUrl: './delete-multiple-patients.component.html',
  styleUrls: ['./delete-multiple-patients.component.css']
})
export class DeleteMultiplePatientsComponent implements OnInit {
  patientService: PatientService;
  patients: Array<Patient> = [];

  constructor(patientService: PatientService,
              private patientListService: PatientListService,
              private router: Router) {
    this.patientService = patientService;
  }

  ngOnInit(): void {
    this.patients = history.state.patients;
  }

  deletePatientenZeile(){
    this.patients.forEach((patient) => {
      this.patientListService.deletePatient(patient).then(success => {
        this.patientService.rerenderPatients(this.patientListService.getPatients());
      }, error => {
        console.log("This is not so good")
      });
    })
  }

}
