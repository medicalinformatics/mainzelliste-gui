import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MatOption} from "@angular/material/core";
import {ConsentTemplate} from "../model/consent-template";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "../model/consent";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css']
})
export class ConsentDetailComponent implements OnInit {

  @Input() dataModel!: Consent;
  @Output() dataModelChange = new EventEmitter<Consent>();
  consentTemplates: Map<string, ConsentTemplate>;
  @ViewChild('templateSelection') templateSelection!: MatSelect;
  @Input() edit: boolean = false;

  constructor(private consentService: ConsentService) {
    this.consentTemplates = new Map();
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
    return this.dataModel.period == 0 ? " für einen unbegrenzten Zeit-Raum" :
      ` bis ${new Date((this.dataModel.validFrom?.getTime() || 0)
        + this.dataModel.period).toLocaleDateString()}`;
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
