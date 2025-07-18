import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, FieldType } from 'src/app/model/field';
import {FieldService} from "../../services/field.service";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'view-patient-fields',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
})

export class ViewPatientComponent implements OnInit {


 fields: Field[] = [];
  @Input() patientFields:  {[key: string]: any} = {};
  @Output() fieldEvent = new EventEmitter<{[key: string]: any}>();

  constructor(
        fieldService: FieldService,
        private translate: TranslateService
      ) { 
    this.fields = fieldService.getFields();

  }

  ngOnInit(): void { 
    
  }

  fieldChanged(){
    this.fieldEvent.emit(this.fields);
  }

  isDate(field: FieldType): any {
    return field == FieldType.DATE;
  }

}