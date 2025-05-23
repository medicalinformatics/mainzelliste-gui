import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsentService } from 'src/app/consent/consent.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-csv-policy-import-dialog',
  templateUrl: './csv-policy-import-dialog.component.html',
  styleUrls: ['./csv-policy-import-dialog.component.css']
})
export class CsvPolicyImportDialogComponent {
  errorMessages: string[] = [];
  isLoading: boolean = false;
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
  fileContents: string[] = [];
  importResult: { added: number; failed: number } | null = null;
  totalRows: number = 0;
  fileValid: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CsvPolicyImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policySetId: string },
    private consentService: ConsentService,
    private translate: TranslateService,
  ) {}

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!this.selectedFiles.some(f => f.name === file.name)) {
        this.handleFile(file);
      }
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!this.selectedFiles.some(f => f.name === file.name)) {
          this.handleFile(file);
        }
      }
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

 handleFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const fileContent = e.target.result;
    const policies = this.parseCSV(fileContent);
    const validationErrors = this.validatePolicies(policies);

    if (validationErrors.length > 0) {
      const groupedErrors: { [key: string]: string } = {};
      validationErrors.forEach(err => {
        if (!groupedErrors[err.category]) {
          groupedErrors[err.category] = `${file.name}: ${err.message}`;
        }
      });
      this.errorMessages = Object.values(groupedErrors);
      this.fileValid = false;
      return;
    }

    this.selectedFiles.push(file);
    this.selectedFileNames.push(file.name);
    this.fileContents.push(fileContent);
    this.errorMessages = [];
    this.fileValid = true;
  };
    reader.readAsText(file);
  }

  removeFile(fileName: string) {
    const index = this.selectedFiles.findIndex(f => f.name === fileName);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
      this.selectedFileNames.splice(index, 1);
      this.fileContents.splice(index, 1);
    }
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
        this.errorMessages.push(this.translate.instant('configuration.policySet.csv.error.invalid'));
      }
    }
    return policies;
  }

  validatePolicies(policies: Array<{ code: string, name: string }>): Array<{ category: string, message: string }> {
    const errors: Array<{ category: string, message: string }> = [];
    const codeCounts = new Map<string, number>();

    policies.forEach(policy => {
      const code = policy.code;
      if (/\s/.test(code)) {
        errors.push({ category: 'whitespace', message: this.translate.instant('configuration.policySet.csv.error.whitespace') });
      }
      codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
    });

    for (const [code, count] of codeCounts.entries()) {
      if (count > 1) {
        errors.push({ category: 'duplicate', message: this.translate.instant('configuration.policySet.csv.error.duplicate') });
      }
    }
    return errors;
  }

  confirmImport() {
  if (!this.fileValid) {
    return;
  }
  if (!this.fileContents || this.fileContents.length === 0) {
    this.errorMessages.push('No file content found.');
    return;
  }
  this.errorMessages = [];
  this.importResult = null;

  let allPolicies: Array<{ code: string, name: string }> = [];
  for (const content of this.fileContents) {
    const policies = this.parseCSV(content);
    allPolicies = allPolicies.concat(policies);
  }
  this.totalRows = allPolicies.length;
  if (allPolicies.length === 0) {
    this.errorMessages.push('No valid policies found in the file(s).');
    return;
  }
  this.addPolicies(allPolicies);
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
