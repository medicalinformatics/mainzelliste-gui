import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MAT_DATE_LOCALE, MatOption} from "@angular/material/core";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "../consent.model";
import _moment, {Moment} from "moment";
import {ConsentTemplateFhirWrapper} from "../../model/consent-template-fhir-wrapper";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css']
})
export class ConsentDetailComponent implements OnInit {

  @Input() dataModel!: Consent;
  @Output() dataModelChange = new EventEmitter<Consent>();
  consentTemplates: Map<string, ConsentTemplateFhirWrapper>;
  @ViewChild('templateSelection') templateSelection!: MatSelect;
  @Input() edit: boolean = false;
  localDateFormat:string;
  validFrom:Moment

  constructor(private consentService: ConsentService,
  @Inject(MAT_DATE_LOCALE) private _locale: string) {
    _moment.locale(this._locale);
    this.consentTemplates = new Map();
    this.localDateFormat = _moment().localeData().longDateFormat('L');
    this.validFrom = _moment();
  }

  ngOnInit(): void {
    // get a list of templates from Mainzelliste as map <id , fhir4.Questionnaire>
    this.consentService.getConsentTemplates().then(r => this.consentTemplates = r);

    //reset selection if no template selected
    if ((!this.dataModel || !this.dataModel.id) && (!this.edit && this.templateSelection)) {
      this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }
  }

  /**
   * Init data model from the selected consent template
   * @param consentTemplateId
   */
  initDataModel(consentTemplateId: string) {
    this.dataModel = this.consentService.getNewConsentDataModelFromTemplate(
      this.consentTemplates.get(consentTemplateId));
    // propagate change to parent component
    this.dataModelChange.emit(this.dataModel);
  }

  /**
   * get default selected consent template from data model
   */
  getSelectedTemplate(): string {
    return (this.dataModel && this.dataModel.id != undefined) ? this.dataModel.template?.name || "" : ""
  }

  getConsentExpiration(): string {
    let period = this.dataModel.period;
    this.validFrom = this.dataModel.validFrom || _moment();
    return this.dataModel.period == 0 ? " für einen unbegrenzten Zeit-Raum" :
      ` bis ${new Date((this.dataModel.validFrom?.toDate().getTime() || 0)
        + period).toLocaleDateString()}`;
  }

  /** Utils Method **/

  getTypeOf(item: ConsentItem): string {
    if (item === null) {
      return "null";
    } else if (item instanceof ConsentDisplayItem) {
      return 'ConsentDisplayItem';
    } else if (item instanceof ConsentChoiceItem) {
      return 'ConsentChoiceItem';
    }
    return '';
  }

  toChoiceItem(item: ConsentItem): ConsentChoiceItem {
    return item as ConsentChoiceItem;
  }
}
