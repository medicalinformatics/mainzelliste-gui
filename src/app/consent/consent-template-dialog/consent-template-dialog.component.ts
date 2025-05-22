import {Component, Inject, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentTemplateDetailComponent} from "../consent-template-detail/consent-template-detail.component";
import {ChoiceItem, ConsentTemplate} from "../consent-template.model";
import {NgForm} from "@angular/forms";
import {ConsentService} from "../consent.service";
import {TranslateService} from "@ngx-translate/core";
import {getErrorMessageFrom} from "../../error/error-utils";

@Component({
  selector: 'app-consent-template-dialog',
  templateUrl: './consent-template-dialog.component.html',
  styleUrls: ['./consent-template-dialog.component.css']
})
export class ConsentTemplateDialogComponent {

  @ViewChild(ConsentDetailComponent) consentTemplateDetail!: ConsentTemplateDetailComponent;
  public saving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConsentTemplateDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      template: ConsentTemplate,
      readonly: boolean
    },
    public consentService: ConsentService,
    private readonly translate: TranslateService
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(isActive: boolean) {
    this.saving = true;
    this.dataModel.template.status = isActive ? 'active' : 'draft'
    this.consentService.addConsentTemplate(this.dataModel.template)
      .then(r => {
        this.dialogRef.close(this.dataModel.template);
        this.saving = false;
      })
      .catch(error => {
        this.errorMessages.push(getErrorMessageFrom(error, this.translate));
        this.saving = false;
      })
  }


  public disable(consentTemplateForm: NgForm): boolean {
    return (!consentTemplateForm.valid ||
        (!this.dataModel.template.validity.years || this.dataModel.template.validity.years <= 0) &&
        (!this.dataModel.template.validity.months || this.dataModel.template.validity.months == 0) &&
        (!this.dataModel.template.validity.days || this.dataModel.template.validity.days == 0)) ||
      !this.dataModel.template.items.some(e => e.type == 'choice') ||
      this.dataModel.template.items.filter(e => e.type == 'choice').map( e => e as ChoiceItem).some(e => e.policies?.length == 0) ||
      this.dataModel.template.items.some(e => e.type == 'display' && (e.text == undefined || e.text.trim().length == 0) ||
        e.type == 'choice' && (e as ChoiceItem).policies?.length == 0);
  }
}
