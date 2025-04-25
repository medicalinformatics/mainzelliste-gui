import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Validity} from "../../consent/consent-template.model";

@Directive({
  selector: '[appEmptyConsentTemplateValidityPeriod]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmptyConsentTemplateValidityPeriodDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class EmptyConsentTemplateValidityPeriodDirective {
  @Input('appEmptyConsentTemplateValidityPeriod') validityPeriod: Validity = {month: 0, day: 0};

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validityPeriod
      ? emptyValidityPeriodValidator(this.validityPeriod)(control)
      : null;
  }
}
export function emptyValidityPeriodValidator(validityPeriod: Validity): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return validityPeriod.year == 0 && validityPeriod.month == 0 && validityPeriod.day == 0 ? { required: {} } : null;
  };
}
