import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicySetFormComponent>,
    private consentService: ConsentService,
    private translate: TranslateService,
  ) {
    this.policySetForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      externalId: ['']
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policySetForm.valid) {
      this.errorMessages = [];

      const { id, name, externalId } = this.policySetForm.value;
      this.consentService.addPolicySet(id, name, externalId)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (e) => {
            const errorCode = e?.error?.code || e?.status;
            this.handleError(errorCode, e);
          }
        });
    }
  }
  handleError(errorCode: any, e: any) {
    let errorMessageKey: string;
    switch (errorCode) {
      case 400:
        errorMessageKey = "configuration.policySet.error.400";
        break;
      case 409:
        errorMessageKey = "";
        break;
      default:
        this.errorMessages.push(getErrorMessageFrom(e, this.translate));
        return
    }

    this.translate.get(errorMessageKey).subscribe((translatedMessage) => {
      this.errorMessages.push(translatedMessage);
    });
  }
}
