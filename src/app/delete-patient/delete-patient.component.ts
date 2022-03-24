import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {PatientListService} from "../services/patient-list.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-patient',
  templateUrl: './delete-patient.component.html',
  styleUrls: ['./delete-patient.component.css']
})

export class DeletePatientComponent implements OnInit {
  patientService: PatientService;
  patientListService: PatientListService;
  patient: Patient = new Patient();

  constructor(patientService: PatientService,
              patientListService: PatientListService,
              private router: Router) {
        this.patientService = patientService;
        this.patientListService = patientListService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
}

  deletePatientenZeile(){
    console.log("deleted..");
    this.patientListService.deletePatient(this.patient).then((result) => {
      this.patientService.rerenderPatients(this.patientListService.getPatients());
      this.router.navigate(["patientlist-view"]).then(success => {
        console.log('good')
      }, error => {
        console.log('not so good')
      })
    });
  }

}
