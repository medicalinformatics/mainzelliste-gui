import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";
import {FormControl, FormGroup} from "@angular/forms";
import {CreatePatientComponent} from "../createPatient/createPatient.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-patient-fields',
  templateUrl: './patient-fields.component.html',
  styleUrls: ['./patient-fields.component.css']
})
export class PatientFieldsComponent implements OnInit {

  tmpPatient: Patient = new Patient();


  @Input()  fields: {[key: string]: any} = {};
  @Output() fieldEvent = new EventEmitter<{[key: string]: any}>();
  fieldService: FieldService;
  configuredFields: Promise<Array<Field>>;
  @Input() readOnly: boolean= false;
  @Input() merging: boolean=false;

  constructor(fieldService: FieldService) {
    this.fieldService = fieldService;
    this.configuredFields = fieldService.getFields();
    patientService: PatientService;
    // @Input() patient: Patient = new Patient()

  }

  ngOnInit(): void {
  }

  fieldChanged(){
    this.fieldEvent.emit(this.fields);

  }

}
