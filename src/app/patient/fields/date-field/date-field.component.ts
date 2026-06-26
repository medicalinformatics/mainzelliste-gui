import {Component, Input, model} from '@angular/core';
import {Field} from "../../../model/field";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ControlContainer, FormsModule, NgForm} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {displayError, getFieldErrorMessage} from "../fields-utils";
import {LocalStorageService} from "../../../services/local-storage.service";
import {InvalidBirthdayDirective} from "../../../shared/directives/invalid-birthday-directive";
import {DateTime} from "luxon";

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
    InvalidBirthdayDirective,
  ],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class DateFieldComponent {
  private LOCALE_DATE_FORMAT_MAP: Map<string, string> = new Map<string, string> ([
    ['en-US', 'MM/dd/yyyy'],
    ['de-DE', 'dd.MM.yyyy']
  ]);

  data = model<string | DateTime>();
  @Input() field!: Field


  constructor(
    protected translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {
  }

  getLocalDateFormat():string{
    return this.LOCALE_DATE_FORMAT_MAP.get(this.localStorageService.language) || 'MM/dd/yyyy';
  }

  protected readonly displayError = displayError;
  protected readonly getFieldErrorMessage = getFieldErrorMessage;
}
