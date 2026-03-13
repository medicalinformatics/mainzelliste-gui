import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldService} from "../../services/field.service";
import {Field} from "../../model/field";
import _moment from "moment";
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgForm,
  NgModel,
  ValidationErrors
} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-patient-fields',
    templateUrl: './patient-fields.component.html',
    styleUrls: ['./patient-fields.component.css'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    standalone: false
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

  /*
  postal code autocompletion was implemented based on Bing Copilot results:
  - suggestion for "angular autocomplete choose option automatically when only one is left":
    https://www.bing.com/search?pglt=163&q=angular+autocomplete+choose+option+automatically+when+only+one+is+left&cvid=62302ea78cce475f8450a554ee0b53d2&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIHCAEQ6wcYQNIBCTMyNzk5ajBqMagCALACAQ&FORM=ANNTA1&PC=U531
  - suggestion for "angular forms suggestions based on fetch results" and "angular autocomplete set other field according to chosen option"
    https://www.bing.com/search?pglt=163&q=angular+autocomplete+set+other+field+according+to+chosen+option&cvid=519b8e2706cb4b7097532aac340cf153&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIHCAEQ6wcYQNIBCTIzNjQyajBqMagCALACAA&FORM=ANNTA1&PC=U531
  -
  */
  filteredOptions: City[] = [];

  constructor(
    public fieldService: FieldService,
    private translate: TranslateService,
    private http: HttpClient
    ) {
    this.configuredFields = fieldService.getFields();
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  updateOptions(value: string) {
    console.log(this.fields);
    if (typeof value === 'string' && value.length >= 3) {
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-postal-code/records/?limit=10&where=country_code+like+%22DE%22+and+%28startswith%28place_name%2C+%22${value}%22%29+or+startswith%28postal_code%2C+%22${value}%22%29%29`;
      this.http.get<any>(url).subscribe(reply => {
        this.filteredOptions = reply.results;
        if (this.filteredOptions.length === 1)
          this.onCitySelected(this.filteredOptions[0]);
      })
    }
  }

  onCitySelected(city: City) {
    this.fields['PLZ'] = city.postal_code;
    this.fields['Wohnort'] = city.place_name;
    this.fieldChanged();
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

  enableDateFieldValidation(field: NgModel) {
    if (this.readOnly) {
      field.control.clearValidators()
      field.control.updateValueAndValidity()
    }
  }

  displayError(field: NgModel) {
    if (this.readOnly) {
      field.control.clearValidators()
      field.control.updateValueAndValidity()
      return false
    } else {
      //let isFieldsEmpty = !Object.keys(this.fields).length || !Object.entries(this.fields).some( (e) => e[1].length > 0);
      return field.invalid &&
          (field.dirty || field.touched) &&
          (field.errors?.['pattern'] || field.errors?.['required']);
    }
  }

  public getFieldClass(){
    return "inputField ml-field" + (this.readOnly ? " inputFieldDisabled" : "");
  }
}

export class DirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

class City {
  /*
  records from geodata-postal-code have more entries,
  see https://public.opendatasoft.com/explore/assets/geonames-postal-code/view/?page=1
  Yet this are all that seem reasonable useful for our application.
  */
  postal_code = "";
  place_name = "";    // name of municipality (city) or of instition with own postal code (Postgroßempfänger, at least in Germany)
  country_code = "";  // two-letter ISO country code, DE for Germany
  admin_name1 = "";   // correspondes to state (Bundesland in Germany), not given in all countries
  admin_name3 = "";   // correspondes to county (Kreis or kreisfreie Stadt/Stadtkreis in Germany), not given in all countries
}
