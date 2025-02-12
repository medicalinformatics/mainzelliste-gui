import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsentService } from 'src/app/consent/consent.service';
import { getErrorMessageFrom } from 'src/app/error/error-utils';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicyFormComponent>,
    private consentService: ConsentService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { policySetId: string }
  ) {
    this.policyForm = this.fb.group({
      code: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policyForm.valid) {
      this.errorMessages = [];
      const { code, text } = this.policyForm.value;
      
      this.consentService.addPolicy(this.data.policySetId, code, text)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (e) => {
            this.errorMessages.push(getErrorMessageFrom(e, this.translate));
          }
        });
    }
  }
}
