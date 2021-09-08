import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})
export class IdcardComponent implements OnInit {
  patient: Patient = new Patient();
  fields: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

}
