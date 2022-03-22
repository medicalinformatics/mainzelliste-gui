import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {
  patientService: PatientService;
  patient: Patient = new Patient();

  constructor(private route: ActivatedRoute, patientService: PatientService) {
    this.patientService = patientService;
   /* this.route.queryParams.subscribe(params => {
      this.patient.ids[0].idString = params['patientid'];})*/
  }

  ngOnInit(): void {
    this.patient = history.state.patient;

/*    this.route.queryParams.subscribe(params => {
      this.patient.ids[0].idString = params['patientid'];*/


  }



}
