import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";


@Component({
  selector: 'app-clone',
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.css']
})
export class CloneComponent implements OnInit {
  patient: Patient = new Patient();
  fields: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

}
