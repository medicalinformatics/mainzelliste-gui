import {Component, Input, model} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Field} from "../../../model/field";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ControlContainer, FormsModule, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {NgIf} from "@angular/common";
import {displayError, getFieldErrorMessage} from "../fields-utils";

@Component({
  selector: 'app-text-field',
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    TranslatePipe,
    MatInput,
    FormsModule,
    NgIf
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class TextFieldComponent {
  data = model<string>();
  @Input() field!: Field

  constructor(
    protected translate: TranslateService
  ) {
  }

  protected readonly displayError = displayError;
  protected readonly getFieldErrorMessage = getFieldErrorMessage;
}
