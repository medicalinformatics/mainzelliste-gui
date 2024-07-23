import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Validity} from "../consent-template.model";
import {NgModel, ValidationErrors} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'consent-template-validity-period-dialog',
  templateUrl: 'consent-template-validity-period-dialog.html',
})

export class ConsentTemplateValidityPeriodDialog implements OnInit {

  @ViewChild(ConsentTemplateValidityPeriodDialog) newId!: ConsentTemplateValidityPeriodDialog;
  public validityDays: number[] = Array(32).fill(0).map((x, i) => i++)
  public validityMonths: number[] = Array(13).fill(0).map((x, i) => i++)

  constructor(
    public dialogRef: MatDialogRef<ConsentTemplateValidityPeriodDialog>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public validityPeriod: Validity
  ) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.validityPeriod);
  }

  displayError(field: NgModel) {
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }

  getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null) {
    if (errors?.['pattern'])
      return `${this.translate.instant('patientFields.error_value_text1')} ${this.translate.instant('consent_template.' + fieldName )} ${this.translate.instant('patientFields.error_value_text2')}`;
    else if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('consent_template.' + fieldName )} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return "fehler";
  }
}
