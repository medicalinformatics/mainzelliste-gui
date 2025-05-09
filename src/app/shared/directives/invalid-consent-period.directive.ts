import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from "@angular/forms";
import {ConsentValidityPeriod} from "../../consent/consent-validity-period";

@Directive({
  selector: '[appInvalidConsentPeriod]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InvalidConsentPeriodDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class InvalidConsentPeriodDirective implements Validator {
  @Input('appInvalidConsentPeriod') consentPeriod!: ConsentValidityPeriod;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.consentPeriod ? this.validatePeriod(this.consentPeriod)(control) : null;
  }

  validatePeriod(validityPeriod: ConsentValidityPeriod): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || !validityPeriod.period && validityPeriod.validUntil
      && control.value > validityPeriod.validUntil?.toJSDate().getTime() ?
        {invalidPeriodStartDate: {value: control.value}} : null;
    };
  }
}
