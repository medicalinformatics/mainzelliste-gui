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
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
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

  // based on Bing copilot results for "angular forms suggestions based on fetch results" and "angular autocomplete set other field according to chosen option"
  // https://www.bing.com/search?pglt=163&q=angular+autocomplete+set+other+field+according+to+chosen+option&cvid=519b8e2706cb4b7097532aac340cf153&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIHCAEQ6wcYQNIBCTIzNjQyajBqMagCALACAA&FORM=ANNTA1&PC=U531
  postalCodeControl = new FormControl('');
  cityControl = new FormControl({value: '', disabled: true});
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<City[]>;

  constructor(
    public fieldService: FieldService,
    private translate: TranslateService,
    private http: HttpClient
    ) {
    this.configuredFields = fieldService.getFields();
    this.localDateFormat = _moment().localeData().longDateFormat('L');

    this.filteredOptions = this.postalCodeControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && (value.length >= 3)) {
          return this._fetchSuggestions(value);
        } else {
          return of([]);
        }
      })
    );
    // based on Bing/Copilot suggestion for "angular autocomplete choose option automatically when only one is left"
    // https://www.bing.com/search?pglt=163&q=angular+autocomplete+choose+option+automatically+when+only+one+is+left&cvid=62302ea78cce475f8450a554ee0b53d2&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIHCAEQ6wcYQNIBCTMyNzk5ajBqMagCALACAQ&FORM=ANNTA1&PC=U531
    this.filteredOptions.subscribe(opts => {
      if (opts.length === 1) {
        this.onCitySelected(opts[0]);
      }
    })
  }

  private _fetchSuggestions(value: string): Observable<City[]> {
    const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-postal-code/records/?limit=10&where=country_code+like+%22DE%22+and+%28startswith%28place_name%2C+%22${value}%22%29+or+startswith%28postal_code%2C+%22${value}%22%29%29`;
    return this.http.get<any>(url).pipe(
      map(reply => reply.results),
    );
  }

  onCitySelected(city: City) {
    this.postalCodeControl.setValue(city.postal_code);
    this.cityControl.setValue(city.place_name);
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
  postal_code = "";
  place_name = "";
  admin_name1 = "";
  admin_name3 = "";
}
