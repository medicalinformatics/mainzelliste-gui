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
import { AppConfigService } from 'src/app/app-config.service';

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
  autocompletion was implemented with the help of several following Bing/Copilot results, e.g.:
   - https://www.bing.com/search?pglt=163&q=angular+autocomplete+set+other+field+according+to+chosen+option&cvid=519b8e2706cb4b7097532aac340cf153&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIHCAEQ6wcYQNIBCTIzNjQyajBqMagCALACAA&FORM=ANNTA1&PC=U531

  */
  filteredStreets: Street[] = [];

  constructor(
    public fieldService: FieldService,
    public appConfigService: AppConfigService,
    private translate: TranslateService,
    private http: HttpClient
    ) {
    this.configuredFields = fieldService.getFields();
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  updateStreets(streetInput: string, postalCodeInput = '', localityInput = '') {
    if (typeof streetInput === 'string' && streetInput.length >= 5) {
      streetInput = streetInput.replace('straße', 'str.');
      streetInput = streetInput.replace('straß', 'str.');
      streetInput = streetInput.replace('stra', 'str.');
      let url = '';
      if (postalCodeInput)
        url = `https://openplzapi.org/de/Streets?name=%5E${streetInput}%24&postalCode=%5E${postalCodeInput}&pageSize=10`;
      else if (localityInput)
        url = `https://openplzapi.org/de/Streets?name=%5E${streetInput}%24&locality=%5E${localityInput}&pageSize=10`;
      else
        url = `https://openplzapi.org/de/Streets?name=%5E${streetInput}&pageSize=10`;
      this.http.get<any>(url, {observe: 'response'}).subscribe(reply => { 
        if (reply.headers.get('x-total-pages') == '1')
          this.filteredStreets = reply.body;
        else
          this.filteredStreets = [];
      });
    } else {
      this.filteredStreets = [];
    }
  }

  displayStreet(street: Street | string | null): string {
    if (typeof street === 'string') {
      street = street.replace('str.', 'straße');
      return street;
    } else {
      return street?.name ?? '';
    }
  }

  selectIfFieldLeft() {
    if (this.filteredStreets.length === 1)
      this.onStreetSelected(this.filteredStreets[0]);
  }

  onStreetSelected(street: Street) {
    this.fields['Straße'] = street.name;
    this.fields['PLZ'] = street.postalCode;
    this.fields['Wohnort'] = street.locality;
    this.fieldChanged();
  }

  displayPostalCode(value: Street | string | null): string {
    if (typeof value === 'string')
      return value;
    else
      return value?.postalCode ?? '';
  }

  updateStreetsBasedOnPostalCodeInput(postalCodeInput: string) {
    this.updateStreets(this.fields['Straße'], postalCodeInput);
  }

  displayLocality(value: Street | string | null): string {
    if (typeof value === 'string')
      return value;
    else
      return value?.locality ?? '';
  }

  updateStreetsBasedOnLocalityInput(localityInput: string) {
    if (!this.fields['PLZ'])
      this.updateStreets(this.fields['Straße'], '', localityInput);
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

class Street {
  // only the relevant subset of the attributes given for every street by OpenPLZ API,
  // see https://www.openplzapi.org/de/germany/#abfrage-straen (in German) for full list

  name = "";
  postalCode = "";
  locality = ""; // name of the municipality without additions like "Stadt" or "kreisangehörige Gemeinde"
}
