import {Component, Inject, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import {ConsentService} from 'src/app/consent/consent.service';
import {getErrorMessageFrom} from 'src/app/error/error-utils';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {take} from 'rxjs/operators';
import { ErrorCardComponent } from '../../shared/components/error-card/error-card.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-policy-form',
    templateUrl: './policy-form.component.html',
    styleUrls: ['./policy-form.component.css'],
    imports: [MatDialogTitle, ErrorCardComponent, FormsModule, ReactiveFormsModule, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, NgIf, MatError, MatDialogActions, MatButton, MatDialogClose, MatIcon, MatProgressSpinner, TranslatePipe]
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;
  errorMessages: string[] = [];
  saving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicyFormComponent>,
    private consentService: ConsentService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { policySetId: string }
  ) {
    this.policyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('\\S+')]],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policyForm.valid) {
      this.errorMessages = [];
      const { code, text } = this.policyForm.value;
      this.saving = true;
      this.policyForm.disable();

      this.consentService.addPolicy(this.data.policySetId, code, text)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (e) => {
            this.errorMessages.push(getErrorMessageFrom(e, this.translate));
            this.policyForm.enable();
            this.saving = false;
          }
        });
    }
  }

  displayError(field: AbstractControl<any>) {
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }

  getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null) {
    if (errors?.['pattern'])
      return `${this.translate.instant('patientFields.error_value_text1')} ${this.translate.instant('configuration.policy.' + fieldName)} ${this.translate.instant('patientFields.error_value_text2')}`;
    else if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('configuration.policy.' + fieldName)} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return "fehler";
  }
}
