import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";


@Component({
  selector: 'app-similar-patient',
  templateUrl: './similarPatient.component.html',
  styleUrls: ['./similarPatient.component.css']
})
export class SimilarPatientComponent implements OnInit {
  patient: Patient = new Patient();

  constructor() { }

  ngOnInit(): void {
    this.patient = history.state.patient;
  }

}
