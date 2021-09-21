import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";


@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent implements OnInit {
  title="Patient einfügen";
  patient: Patient;

  constructor() {
    this.patient = new Patient();
  }

  ngOnInit(): void {
  }

}
