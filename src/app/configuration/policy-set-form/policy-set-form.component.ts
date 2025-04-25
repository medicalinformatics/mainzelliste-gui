import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConsentService } from 'src/app/consent/consent.service';
import { take } from 'rxjs/operators';
import { getErrorMessageFrom } from 'src/app/error/error-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policy-set-form',
  templateUrl: './policy-set-form.component.html',
  styleUrls: ['./policy-set-form.component.css']
})
export class PolicySetFormComponent implements OnInit {
  policySetForm: FormGroup;
  errorMessages: string[] = [];
  saving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicySetFormComponent>,
    private consentService: ConsentService,
    private translate: TranslateService,
  ) {
    this.policySetForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('\\S+')]],
      name: ['', Validators.required],
      externalId: ['']
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policySetForm.valid) {
      this.errorMessages = [];
      this.saving = true;
      this.policySetForm.disable();
      const { id, name, externalId } = this.policySetForm.value;
      this.consentService.addPolicySet(id, name, externalId)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (e) => {
            this.errorMessages.push(getErrorMessageFrom(e, this.translate));
            this.policySetForm.enable();
            this.saving = false;
          }
        });
    }
  }

  displayError(field: any) {
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }

  getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null) {
    if (errors?.['pattern'])
      return `${this.translate.instant('patientFields.error_value_text1')} ${this.translate.instant('configuration.policySet.' + fieldName)} ${this.translate.instant('patientFields.error_value_text2')}`;
    else if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('configuration.policySet.' + fieldName)} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return 'fehler';
  }

}
