import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Validity} from "../../consent/consent-validity-period";

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
  @Input('appEmptyConsentTemplateValidityPeriod') validityPeriod: Validity = new Validity();

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validityPeriod
      ? emptyValidityPeriodValidator(this.validityPeriod)(control)
      : null;
  }
}
export function emptyValidityPeriodValidator(validityPeriod: Validity): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return validityPeriod.years == 0 && validityPeriod.months == 0 && validityPeriod.days == 0 ? { required: {} } : null;
  };
}
