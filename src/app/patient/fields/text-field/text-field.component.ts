import {Component, Input, model} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Field} from "../../../model/field";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ControlContainer, FormsModule, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {NgIf} from "@angular/common";

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
    private translate: TranslateService
  ) {
  }

  public getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null): string {
    if (errors?.['pattern'])
      return this.translate.instant('patientFields.error_value_text1') + " \"" + fieldName + "\" " + this.translate.instant('patientFields.error_value_text2');
    else if (errors?.['required'])
      return this.translate.instant('patientFields.error_mandatory_text1') + " \"" + fieldName + "\" " + this.translate.instant('patientFields.error_mandatory_text2');
    else
      return "fehler";
  }

  displayError(field: NgModel) {
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }
}
