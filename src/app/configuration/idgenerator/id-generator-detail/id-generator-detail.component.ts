import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {IDGeneratorConfig, IDGeneratorType} from "../../../model/id-generator-config";
import {PatientListService} from "../../../services/patient-list.service";
import {AppConfigService} from "../../../app-config.service";
import {IdGenerator} from "../../../model/idgenerator";

@Component({
  selector: 'app-id-generator-detail',
  templateUrl: './id-generator-detail.component.html',
  styleUrls: ['./id-generator-detail.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class IdGeneratorDetailComponent implements OnInit {

  protected readonly Object = Object;
  protected readonly IDGeneratorType = IDGeneratorType;

  @Input() dataModel!: IDGeneratorConfig;
  @Input() nodeName!: string;

  constructor(
    private translate: TranslateService,
    private patientService: PatientListService,
    private configService: AppConfigService
  ) {
  }

  ngOnInit(): void {
  }

  displayError(field: NgModel) {
    return field.invalid &&
      (field.dirty || field.touched) &&
      (field.errors?.['pattern'] || field.errors?.['required']);
  }

  getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null) {
    if (errors?.['pattern'])
      return `${this.translate.instant('patientFields.error_value_text1')} ${this.translate.instant('configuration.idGenerator.' + fieldName)} ${this.translate.instant('patientFields.error_value_text2')}`;
    else if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('configuration.idGenerator.' + fieldName)} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return "fehler";
  }

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
        case IDGeneratorType.CryptoIDGenerator:
          this.dataModel.parameters = {
            baseIdType: this.findBaseIdType()
          };
          break;

      }
    } else {
      console.log("empty data model")
    }
  }

  private findBaseIdType(): string {
    if (this.dataModel.nodeName === 'default') {
      return this.patientService.findDefaultIdType(this.patientService.getIdTypes("R"))
    } else {
      return this.getAssociatedBaseIdTypes()[0];
    }
  }

  private getRandomNumber(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is
  }


  public getBaseIdTypes() {
    return this.dataModel.nodeName === 'default' ? this.getUniqueBaseIdTypes() : this.getAssociatedBaseIdTypes()
  }

  private getUniqueBaseIdTypes(): string[] {
    let idGenerators: IdGenerator[] = this.configService.getMainzellisteIdGenerators();
    return [...this.patientService.getUniqueIdTypes(false, "R")
    .filter(e => idGenerators.some(g => g.isPersistent && g.idType == e)),
      ...this.patientService.getUniqueIdTypes(true, "R")]
  }

  private getAssociatedBaseIdTypes(): string[] {
    let idGenerators: IdGenerator[] = this.configService.getMainzellisteAssociatedIdGeneratorsMap().get(this.dataModel.nodeName) ?? [];
    return [...this.patientService.getAssociatedIdTypes(false, "R", this.dataModel.nodeName)
    .filter(e => idGenerators.some(g => g.isPersistent && g.idType == e)),
      ...this.patientService.getAssociatedIdTypes(true, "R", this.dataModel.nodeName)]
  }
}
