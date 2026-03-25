import {Component, Input, model} from '@angular/core';
import {Field} from "../../../model/field";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {TranslatePipe} from "@ngx-translate/core";
import {ControlContainer, FormsModule, NgForm} from "@angular/forms";
import _moment from "moment";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";

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
  ],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class DateFieldComponent {
  data = model<string>();
  @Input() field!: Field

  localDateFormat: string;

  constructor() {
    this.localDateFormat = _moment().localeData().longDateFormat('L');
  }
}
