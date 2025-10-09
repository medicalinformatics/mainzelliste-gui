import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from "@angular/forms";
import {Validity} from "../../consent/consent-validity-period";
import {Id} from "../../model/id";

@Directive({
  selector: '[appPatientIds], [appExternalIdType]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidRelatedExternalIdsDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class ValidRelatedExternalIdsDirective implements Validator{
  @Input('appPatientIds') patientIds: Id[] = [];
  @Input('appExternalIdType') externalIdType: string = "";
  // @Input('appAllExternalId') validityPeriod: Validity = new Validity();

  validate(control: AbstractControl): ValidationErrors | null {
    return this.patientIds && this.patientIds.length > 0 && this.externalIdType
      ? validExternalId(this.externalIdType, this.patientIds)(control)
      : null;
  }
}
export function validExternalId(externalIdType: string, patientIds: Id[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !control.value || control.value.length > 0
    && patientIds.some(id => id.idType == externalIdType && control.value == id.idString) ?
      { idStringExist: {value: control.value} } : null;
  };
}
