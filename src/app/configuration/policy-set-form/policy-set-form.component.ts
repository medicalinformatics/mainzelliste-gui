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
    styleUrls: ['./policy-set-form.component.css'],
    standalone: false
})
export class PolicySetFormComponent implements OnInit {
  policySetForm: FormGroup;
  errorMessages: string[] = [];
  saving: boolean = false;

  selectedFile: File | undefined;
  policies: Array<{ code: string, name: string }> = [];
  importResult: { added: number; failed: number } | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicySetFormComponent>,
    private consentService: ConsentService,
    private translate: TranslateService,
  ) {
    this.policySetForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('\\S+')]],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policySetForm.valid && this.errorMessages.length == 0) {
      this.policySetForm.disable();
      this.saving = true;
      const { id, name, externalId } = this.policySetForm.value;
      this.consentService.addPolicySet(id, name)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            // TODO refactor: chain rest api requests instead of calling await inside subscribe
            const policySetId = response.id
            if (this.policies.length > 0 && this.errorMessages.length == 0) {
              this.importResult = null;
              let addedCount = 0;
              let failedCount = 0;
              const requests = this.policies.map(async policy => {
                try {
                  await this.consentService.addPolicy(policySetId, policy.code, policy.name)
                  .pipe(take(1)).toPromise();
                  addedCount++;
                } catch {
                  failedCount++;
                }
              });
              Promise.all(requests).then(() => {
                this.importResult = { added: addedCount, failed: failedCount };
                this.saving = false;
                this.dialogRef.close({ policySetId, importResult: this.importResult });
              });
            } else {
              this.saving = false;
              this.dialogRef.close(response);
            }
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

  onFileSelected(event: any) {
    this.readFile(event.target.files[0]);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = event.dataTransfer.files;
      if (files.length > 0 && (!this.selectedFile || this.selectedFile.name != files[0].name)) {
        this.readFile(files[0]);
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  removeFile() {
    this.policies = [];
    this.selectedFile = undefined;
    this.errorMessages = []
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const policies = this.parseCSV(e.target.result);
      // if (this.errorMessages.length > 0)
      //   return;
      this.policies = policies;
      this.selectedFile = file;
    };
    reader.readAsText(file);
  }

  parseCSV(csvText: string): Array<{ code: string, name: string }> {
    // check empty file
    if(csvText.trim().length == 0) {
      this.errorMessages.push(this.translate.instant('CSVFileUploader.upload_error_empty'));
      return [];
    }

    // parse CSV file
    const lines = csvText.split(/\r\n|\n/);
    lines.shift();
    const policies: Array<{ code: string, name: string }> = [];
    for (const line of lines) {
      if (line.trim() === '') continue;
      const [code, name] = line.split(';');
      if (!code || !name) {
        this.errorMessages.push(this.translate.instant('configuration.policySet.csv.error.invalid'));
        return [];
      }
      policies.push({code: code.trim(), name: name.trim()});
    }

    // validate all policies
    const codeCounts = new Map<string, number>();

    // check empty code
    policies.forEach(policy => {
      const code = policy.code;
      if (/\s/.test(code)) {
        this.errorMessages.push(this.translate.instant('configuration.policySet.csv.error.whitespace'));
      }
      codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
    });

    // find duplicate codes
    for (const [code, count] of codeCounts.entries()) {
      if (count > 1) {
        this.errorMessages.push(this.translate.instant('configuration.policySet.csv.error.duplicate'));
      }
    }
    return policies;
  }
}
