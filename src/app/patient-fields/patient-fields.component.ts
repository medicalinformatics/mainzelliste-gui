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

  @Output() slideFieldEvent = new EventEmitter<{name:string,value:string}>();

  fieldService: FieldService;
  configuredFields: Promise<Array<Field>>;
  @Input() readOnly: boolean= false;
  @Input() merging: boolean=false;
  @Input() merging2: boolean=false;

  @Output() selectedP = new EventEmitter<PatientFieldsComponent>();

  finalPatient = new Patient;

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

  slideData(value: string, name: string): void{
      this.finalPatient.fields[name]= value;
      this.slideFieldEvent.emit({value:value, name:name});
  };

  selectPatient() {
    console.log("Data will be emitted to MergeComponent")
    this.selectedP.emit(this);
    console.log(this);

  }

}
