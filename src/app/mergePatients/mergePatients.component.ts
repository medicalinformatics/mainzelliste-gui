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
  patient: Patient = new Patient();
  @Input() readOnly: boolean= false;


  @Input() fields: {[key: string]: any} = {};
  fieldService: FieldService;
  configuredFields: Promise<Array<Field>>;

  constructor(fieldService: FieldService) {
    this.fieldService = fieldService;
    this.configuredFields = fieldService.getFields();
    patientService: PatientService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

}
