import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {IDGeneratorConfig, IDGeneratorType} from "../../../model/id-generator-config";

@Component({
  selector: 'app-id-generator-detail',
  templateUrl: './id-generator-detail.component.html',
  styleUrls: ['./id-generator-detail.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class IdGeneratorDetailComponent implements OnInit {

  @Input() dataModel! : IDGeneratorConfig;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {}

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

  protected readonly IDGeneratorType = IDGeneratorType;

  idGeneratorSelected(idGenerator: IDGeneratorType) {
    if (this.dataModel != undefined) {
      this.dataModel.idGenerator = idGenerator
      switch (idGenerator) {
        case IDGeneratorType.PIDGenerator:
          this.dataModel.parameters = {
            k1: this.getRandomNumber(1, 99),
            k2: this.getRandomNumber(1, 99),
            k3: this.getRandomNumber(1, 99),
            rndwidth: 0
          };
          break;
        case IDGeneratorType.ExternalIDGenerator:
          this.dataModel.parameters = {};
          break;
        case IDGeneratorType.SimpleIDGenerator:
          this.dataModel.parameters = {};
          break;
      }
    } else {
      console.log("empty data model")
    }
  }
  private getRandomNumber(min:number, max:number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is
  }
  protected readonly Object = Object;
}
