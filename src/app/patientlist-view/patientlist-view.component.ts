import { Component, OnInit } from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";

@Component({
  selector: 'app-patientlist-view',
  templateUrl: './patientlist-view.component.html',
  styleUrls: ['./patientlist-view.component.css']
})
export class PatientlistViewComponent implements OnInit {
    title="Patientenliste";
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

}
