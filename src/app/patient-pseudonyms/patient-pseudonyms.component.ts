import {Component, Input, OnInit} from '@angular/core';
import {Patient} from "../model/patient";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css']
})

export class PatientPseudonymsComponent implements OnInit {
  patient: Patient = new Patient();
  fields: Array<string> = [];
  @Input() readOnly: boolean= false;

  constructor() {
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

}
