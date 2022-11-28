import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ConsentChoiceItem, ConsentDisplayItem, ConsentItem, ConsentModel} from "../consentModel";
import {MatSelect} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MatOption} from "@angular/material/core";
import {ConsentTemplate} from "../consent-dialog/consent-dialog.component";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css']
})
export class ConsentDetailComponent implements OnInit {

  @Input() consentModel!: ConsentModel;
  @Output() consentModelChange = new EventEmitter<ConsentModel>();
  consentTemplates?: Map<string, ConsentTemplate>;
  @ViewChild('templateSelection') templateSelection!: MatSelect;

  constructor(private consentService: ConsentService) {
  }

  ngOnInit(): void {
    // get a list of templates from Mainzelliste as map <id , title>
    this.consentService.getConsentTemplates().then(r => this.consentTemplates = r);
    //reset selection if no template selected
    if ((!this.consentModel || !this.consentModel.id) && this.templateSelection) {
      this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }
  }

  public saveChanges(): ConsentModel {
    if (this.consentModel) {
      this.consentService.setConsentFhirResource(this.consentModel);
      this.consentModelChange.emit(this.consentModel);
    }
    return this.consentModel;
  }

  selectConsentTemplate(consentTemplateId: string) {
    this.consentModel = this.consentService.convertTemplateToConsentModel(this.consentTemplates?.get(consentTemplateId)?.fhirQuestionnaire);
    this.consentModelChange.emit(this.consentModel);
  }

  getSelectedTemplate(): string {
    return (this.consentModel && this.consentModel.id != undefined) ? this.consentModel.id : ""
  }

  getConsentTimeframe(): string {
    let period = this.consentModel.fhirResource?.provision?.period;
    if(period == undefined ||  !period.end || period.end.trim().length < 1){
      return " für einen unbegrenzten Zeit-Raum"
    } else if ((!period.start || period.start.trim().length < 1)) {
      //calculate period
      return ""
    } else {
      let periodAsDate = new Date(period.end).getTime() - new Date(period.start).getTime();
      return "" + new Date(this.consentModel.date.getTime() + periodAsDate).toLocaleDateString();
    }
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
