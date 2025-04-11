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

  isLoading: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  fileContent: string = '';
  importResult: { added: number; failed: number } | null = null;
  totalRows: number = 0;
  fileValid: boolean = true;

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
            if (this.selectedFile && this.fileValid && this.fileContent) {
              this.confirmImport(response.id);
            } else {
              this.dialogRef.close(response);
            }
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
        errorMessageKey = "configuration.policySet.error.409";
        break;
      default:
        this.errorMessages.push(getErrorMessageFrom(e, this.translate));
        return;
    }
    this.translate.get(errorMessageKey).subscribe((translatedMessage) => {
      this.errorMessages.push(translatedMessage);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleFile(file: File) {
    this.selectedFile = file;
    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileContent = e.target.result;
      const policies = this.parseCSV(this.fileContent);
      const validationErrors = this.validatePolicies(policies);
      if (validationErrors.length > 0) {
        this.errorMessages = validationErrors;
        this.fileValid = false;
      } else {
        this.errorMessages = [];
        this.fileValid = true;
      }
    };
    reader.readAsText(file);
  }

  parseCSV(csvText: string): Array<{ code: string, name: string }> {
    const lines = csvText.split(/\r\n|\n/);
    lines.shift();
    const policies: Array<{ code: string, name: string }> = [];
    for (const line of lines) {
      if (line.trim() === '') continue;
      const [code, name] = line.split(';');
      if (code && name) {
        policies.push({ code: code.trim(), name: name.trim() });
      } else {
        this.errorMessages.push(`Line format error: ${line}`);
      }
    }
    return policies;
  }

  validatePolicies(policies: Array<{ code: string, name: string }>): string[] {
    const errors: string[] = [];
    const codeCounts = new Map<string, number>();

    policies.forEach(policy => {
      const code = policy.code;
      if (/\s/.test(code)) {
        errors.push(`Policy code "${code}" should not contain any whitespace.`);
      }
      codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
    });

    for (const [code, count] of codeCounts.entries()) {
      if (count > 1) {
        errors.push(`Policy code "${code}" appears ${count} times.`);
      }
    }
    return errors;
  }

  confirmImport(policySetId: string) {
    if (!this.fileValid) {
      return;
    }
    if (!this.fileContent) {
      this.errorMessages.push('No file content found.');
      return;
    }
    this.errorMessages = [];
    this.importResult = null;
    const policies = this.parseCSV(this.fileContent);
    this.totalRows = policies.length;
    if (policies.length === 0) {
      this.errorMessages.push('No valid policies found in the file.');
      return;
    }
    this.addPolicies(policySetId, policies);
  }

  addPolicies(policySetId: string, policies: Array<{ code: string, name: string }>) {
    this.isLoading = true;
    let addedCount = 0;
    let failedCount = 0;
    const requests = policies.map(async policy => {
      try {
        await this.consentService.addPolicy(policySetId, policy.code, policy.name)
          .pipe(take(1)).toPromise();
        addedCount++;
      } catch {
        failedCount++;
      }
    });
    Promise.all(requests).then(() => {
      this.isLoading = false;
      this.importResult = { added: addedCount, failed: failedCount };
      this.dialogRef.close({ policySetId, importResult: this.importResult });
    });
  }
}
