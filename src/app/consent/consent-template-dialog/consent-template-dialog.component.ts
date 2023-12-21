import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {MatDialogRef} from "@angular/material/dialog";
import {ConsentTemplateDetailComponent} from "../consent-template-detail/consent-template-detail.component";
import {ChoiceItem, ConsentTemplate} from "../consent-template.model";
import {NgForm} from "@angular/forms";

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
    policy: "2.16.840.1.113883.3.1937.777.24.2.1790"
  }
  public saving:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConsentTemplateDetailComponent>
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(consentTemplateForm: NgForm, isActive: boolean) {
    //consentTemplateForm.form.disable();
    this.saving = true;
    this.dataModel.status = isActive ? 'active' : 'draft'
    this.dialogRef.close(this.dataModel);
  }


  public disable(consentTemplateForm: NgForm): boolean {
    return (!consentTemplateForm.valid ||
        (!this.dataModel.validity.year || this.dataModel.validity.year <= 0) &&
        (!this.dataModel.validity.month || this.dataModel.validity.month == 0) &&
        (!this.dataModel.validity.day || this.dataModel.validity.day == 0)) ||
      !this.dataModel.items.some(e => e.type == 'choice') ||
      this.dataModel.items.some(e => e.type == 'display' && (e.text == undefined || e.text.trim().length == 0) ||
        e.type == 'choice' && (e as ChoiceItem).fhirCoding == undefined);
  }
}
