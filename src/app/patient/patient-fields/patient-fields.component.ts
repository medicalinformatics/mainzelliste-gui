import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldService} from "../../services/field.service";
import {Field} from "../../model/field";
import _moment from "moment";
import {
  ControlContainer, FormControl,
  FormGroupDirective,
  NgForm,
  NgModel,
  ValidationErrors
} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-fields',
  templateUrl: './patient-fields.component.html',
  styleUrls: ['./patient-fields.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PatientFieldsComponent implements OnInit {

  @Input()  fields: {[key: string]: any} = {};
  @Output() fieldEvent = new EventEmitter<{[key: string]: any}>();
  @Output() consentEvent = new EventEmitter<boolean>();
  @Output() slideFieldEvent = new EventEmitter<{name:string,value:string}>();

  configuredFields: Field[];
  @Input() readOnly: boolean= false;
  @Input() side: string="none";
  localDateFormat: string;

  constructor(
    fieldService: FieldService,
    private translate: TranslateService
    ) {
    this.configuredFields = fieldService.getFields();
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  ngOnInit(): void {}

  fieldChanged(){
    this.fieldEvent.emit(this.fields);
  }

  slideData(value: string, name: string): void{
      this.slideFieldEvent.emit({value:value, name:name});
  }

  public getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null): string {
    if (errors?.['pattern'])
      return this.translate.instant('patientFields.error_value_text1') + " \"" + fieldName + "\" " + this.translate.instant('patientFields.error_value_text2');
    else if (errors?.['required'])
      return this.translate.instant('patientFields.error_mandatory_text1') + " \"" + fieldName + "\" " +  this.translate.instant('patientFields.error_mandatory_text2');
    else
      return "fehler";
  }

  displayError(field: NgModel){
    //let isFieldsEmpty = !Object.keys(this.fields).length || !Object.entries(this.fields).some( (e) => e[1].length > 0);
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }
}

export class DirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
