import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";

@Component({
  selector: 'app-patient-fields',
  templateUrl: './patient-fields.component.html',
  styleUrls: ['./patient-fields.component.css']
})

export class PatientFieldsComponent implements OnInit {

  @Input()  fields: {[key: string]: any} = {};
  @Output() fieldEvent = new EventEmitter<{[key: string]: any}>();
  @Output() consentEvent = new EventEmitter<boolean>();
  @Output() slideFieldEvent = new EventEmitter<{name:string,value:string}>();

  configuredFields: Promise<Array<Field>>;
  @Input() readOnly: boolean= false;
  @Input() side: string="none";

  constructor(fieldService: FieldService) {
    this.configuredFields = fieldService.getFields();
    console.log(this.configuredFields);
  }

  ngOnInit(): void {}

  fieldChanged(){
    this.fieldEvent.emit(this.fields);

  }

  slideData(value: string, name: string): void{
      this.slideFieldEvent.emit({value:value, name:name});
  };

}
