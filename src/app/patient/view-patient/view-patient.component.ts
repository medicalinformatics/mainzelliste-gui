import { Component, Input, OnInit } from '@angular/core';
import { Patient } from "../../model/patient";
import { Field } from 'src/app/model/field';

@Component({
  selector: 'view-patient-fields',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
})

export class ViewPatientComponent implements OnInit {

  @Input() fields: Field[] = [];
  @Input() patient: Patient = new Patient();

  constructor() { }

  ngOnInit(): void { }

}