import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";
import {invalidPeriodEndDateValidator} from "../../consent/consent-detail/consent-detail.component";

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
  @Input('appInvalidConsentPeriod') consentPeriod = 0;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.consentPeriod
        ? invalidPeriodEndDateValidator(this.consentPeriod)(control)
        : null;
  }
}
