import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {PatientListService} from "../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-delete-patient',
  templateUrl: './delete-patient.component.html',
  styleUrls: ['./delete-patient.component.css']
})

export class DeletePatientComponent implements OnInit {
  patientService: PatientService;
  patient: Patient = new Patient();

  constructor(private route: ActivatedRoute, patientService: PatientService
              , private patientListService: PatientListService
              , private router: Router) {
    this.patientService = patientService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.route.queryParams.subscribe(params => {
      this.patient.ids[0] = params['patientid'];

    })
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
