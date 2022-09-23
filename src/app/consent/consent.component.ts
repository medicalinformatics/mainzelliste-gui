import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientListService} from "../services/patient-list.service";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})

export class ConsentComponent implements OnInit {
  patient: Patient = new Patient();
  constructor(
    private patientListService: PatientListService,
    private patientService: PatientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.patient = history.state.patient;
  }

}



