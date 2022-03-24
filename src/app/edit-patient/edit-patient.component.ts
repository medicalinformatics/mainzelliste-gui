import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientListService} from "../services/patient-list.service";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  patient: Patient = new Patient();
  private patientListService: PatientListService;
  private patientService: PatientService;

  constructor(patientService: PatientService,
              patientListService: PatientListService,
              private router: Router) {
    this.patientService = patientService;
    this.patientListService = patientListService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
  }

  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  sendChanges() {
    this.patientListService.editPatient(this.patient).then(success => {
      this.patientService.rerenderPatients(this.patientListService.getPatients())
      this.router.navigate(["/patientlist-view"]).then(success => {
          console.log('Navigation to patientlist-view worked')
        }, error => {
          console.log('Navigation to patientlist-view did not work')
        }
      )
    }, error => {})
  }
}


