import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  patient: Patient = new Patient();


  constructor() { }

  ngOnInit(): void {
    this.patient = history.state.patient;
  }

  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }
}


