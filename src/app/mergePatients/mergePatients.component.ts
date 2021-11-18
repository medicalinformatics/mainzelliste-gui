import {Component, Input, OnInit} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";

@Component({
  selector: 'app-merge-patients',
  templateUrl: './mergePatients.component.html',
  styleUrls: ['./mergePatients.component.css']
})
export class MergePatientsComponent implements OnInit {
  patientService: PatientService;
  patients: Array<Patient> = [];
  finalPseudonym: any;
  finalFields: any;
  finalPseudonyms: any;
  Finalpatient= new Patient;

  constructor(patientService: PatientService) {
    this.patientService = patientService;

  }

  ngOnInit(): void {
    this.patients = history.state.patients;
  }

}
