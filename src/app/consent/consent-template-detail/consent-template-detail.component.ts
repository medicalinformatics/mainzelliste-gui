import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {ChoiceItem, ConsentTemplate, DisplayItem, Validity} from "../consent-template.model";
import {ConsentService} from "../consent.service";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {ConsentTemplateValidityPeriodDialog} from "./consent-template-validity-period-dialog";

@Component({
  selector: 'app-consent-template-detail',
  templateUrl: './consent-template-detail.component.html',
  styleUrls: ['./consent-template-detail.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ConsentTemplateDetailComponent implements OnInit {

  @Input() template!: ConsentTemplate;

  public miiFhirBroadConsentVersions = [
    {name: "1.6d", code: "urn:oid:2.16.840.1.113883.3.1937.777.24.2.1790"},
    {name: "1.6f", code:  "urn:oid:2.16.840.1.113883.3.1937.777.24.2.1791"},
    {name: "1.7.2", code:  "urn:oid:2.16.840.1.113883.3.1937.777.24.2.2079"}
  ]

  public templateValidityPeriod: string = this.getValidityPeriodText({day: 0, month: 0, year: 0});

  //TODO dropDow for Scope http://terminology.hl7.org/CodeSystem/consentscope
  //TODO dropDow for category: http://hl7.org/fhir/R4/valueset-consent-category.html

  public selectedModuleType: "choice" | "display" = 'choice';

  public moduleTypes = [
    {
      type: "choice",
      display: "Frage",
    },
    {
      type: "display",
      display: "Text",
    }
  ]

  constructor(
    public consentService: ConsentService,
    private validityPeriodDialog: MatDialog,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  //
  // Handle Error
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

  getValidityPeriodText(validityPeriod: Validity){
    return  validityPeriod.year + ' Jahren - ' + validityPeriod.month + ' Monaten - ' + validityPeriod.day  + ' Tagen';
  }

  openValidityPeriodDialog() {
    const dialogRef = this.validityPeriodDialog.open(ConsentTemplateValidityPeriodDialog,
      { data: this.template.validity, minWidth: '500px'});

    dialogRef.afterClosed().subscribe(validityPeriod => {
      if (validityPeriod) {
        this.template.validity = validityPeriod;
        this.templateValidityPeriod = this.getValidityPeriodText(validityPeriod);
      }
    });
  }
  createModule(selectedModuleType: "choice" | "display") {
    this.template.items = this.template.items || [];
    let item = selectedModuleType == "choice" ?
      new ChoiceItem(this.template.items.length, selectedModuleType, "permit") :
      new DisplayItem(this.template.items.length, selectedModuleType)
    this.template.items.push(item);
  }
}
