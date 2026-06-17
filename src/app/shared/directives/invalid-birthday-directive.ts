import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from "@angular/forms";
import {SemanticType} from "../../model/field";

@Directive({
  selector: '[appValidateBirthday]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InvalidBirthdayDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class InvalidBirthdayDirective implements Validator {
  @Input('appValidateBirthday') sematicType!: SemanticType;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.sematicType ? this.validateBirthday()(control) : null;
  }

  validateBirthday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value && this.sematicType == SemanticType.BIRTHDATE && control.value > new Date() ?
        {invalidBirthday: {value: control.value}} : null;
    };
  }
}
