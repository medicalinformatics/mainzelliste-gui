import {Component, Input, model} from '@angular/core';
import {Field} from "../../../model/field";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ControlContainer, FormsModule, NgForm} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {displayError, getFieldErrorMessage} from "../fields-utils";
import _moment from "moment";

@Component({
  selector: 'app-date-field',
  imports: [
    MatFormField,
    MatLabel,
    TranslatePipe,
    FormsModule,
    MatDatepickerInput,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatError,
    NgIf,
  ],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class DateFieldComponent {
  data = model<string>();
  @Input() field!: Field

  localDateFormat: string;

  constructor( protected  translate: TranslateService) {
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }

  protected readonly displayError = displayError;
  protected readonly getFieldErrorMessage = getFieldErrorMessage;
}
