import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsentService } from 'src/app/consent/consent.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-csv-policy-import-dialog',
  templateUrl: './csv-policy-import-dialog.component.html',
  styleUrls: ['./csv-policy-import-dialog.component.css']
})
export class CsvPolicyImportDialogComponent {
  errorMessages: string[] = [];
  isLoading: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  fileContent: string = '';
  importResult: { added: number; failed: number } | null = null;
  totalRows: number = 0;
  fileValid: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CsvPolicyImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policySetId: string },
    private consentService: ConsentService
  ) {}

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

  confirmImport() {
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
    this.addPolicies(policies);
  }

  addPolicies(policies: Array<{ code: string, name: string }>) {
    this.isLoading = true;
    let addedCount = 0;
    let failedCount = 0;
    const requests = policies.map(policy => {
      return this.consentService.addPolicy(this.data.policySetId, policy.code, policy.name)
        .pipe(take(1)).toPromise()
        .then(() => { addedCount++; })
        .catch(() => { failedCount++; });
    });
    Promise.all(requests).then(() => {
      this.isLoading = false;
      this.importResult = { added: addedCount, failed: failedCount };
    });
  }
}
