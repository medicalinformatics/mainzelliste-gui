import {Component, Input, OnInit} from '@angular/core';
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";

@Component({
  selector: 'app-patient-fields',
  templateUrl: './patient-fields.component.html',
  styleUrls: ['./patient-fields.component.css']
})
export class PatientFieldsComponent implements OnInit {

  @Input() fields: {[key: string]: any} = {};
  fieldService: FieldService;
  configuredFields: Promise<Array<Field>>;

  constructor(fieldService: FieldService) {
    this.fieldService = fieldService;
    this.configuredFields = fieldService.getFields();
  }

  ngOnInit(): void {
  }

}
