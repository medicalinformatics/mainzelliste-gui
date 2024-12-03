import {Component, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {MatDialogRef} from "@angular/material/dialog";
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
  public dataModel: ConsentTemplate = {
    items: [],
    validity: {day: 0, month: 0, year: 0},
    status: "draft",
    policy: "urn:oid:2.16.840.1.113883.3.1937.777.24.2.1790",
    consentModel: true
  }
  public saving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConsentTemplateDetailComponent>,
    public consentService: ConsentService,
    private translate: TranslateService
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(isActive: boolean) {
    //consentTemplateForm.form.disable();
    this.saving = true;
    this.dataModel.status = isActive ? 'active' : 'draft'
    this.consentService.addConsentTemplate(this.dataModel)
      .then(r => {
        this.dialogRef.close(this.dataModel);
        this.saving = false;
      })
      .catch(error => {
        this.errorMessages.push(getErrorMessageFrom(error, this.translate));
        this.saving = false;
      })
  }


  public disable(consentTemplateForm: NgForm): boolean {
    return (!consentTemplateForm.valid ||
        (!this.dataModel.validity.year || this.dataModel.validity.year <= 0) &&
        (!this.dataModel.validity.month || this.dataModel.validity.month == 0) &&
        (!this.dataModel.validity.day || this.dataModel.validity.day == 0)) ||
      !this.dataModel.items.some(e => e.type == 'choice') ||
      this.dataModel.items.some(e => e.type == 'display' && (e.text == undefined || e.text.trim().length == 0) ||
        e.type == 'choice' && (e as ChoiceItem).policy == undefined);
  }
}
