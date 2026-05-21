import {NgModel, ValidationErrors} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

export function getFieldErrorMessage(
  errors: ValidationErrors | null,
  translate: TranslateService
): string {
  if (errors?.['required'])
    return translate.instant('patientFields.error_mandatory_short')
  else if (errors?.['invalidBirthday'])
    return translate.instant('patientFields.invalid_birthday')
  else // if (errors?.['pattern'])
    return translate.instant('patientFields.error_invalid_short');
}

export function displayError(field: NgModel) {
  return field.invalid &&
    (field.dirty || field.touched) &&
    (field.errors?.['pattern'] || field.errors?.['required'] || field.errors?.['invalidBirthday']);
}
