import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {MAT_DATE_LOCALE, MatOption} from "@angular/material/core";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "../consent.model";
import _moment, {Moment} from "moment";

@Component({
  selector: 'app-consent-detail',
  templateUrl: './consent-detail.component.html',
  styleUrls: ['./consent-detail.component.css']
})
export class ConsentDetailComponent implements OnInit {

  @Input() edit: boolean = false;
  @Input() dataModel!: Consent;
  @Output() dataModelChange = new EventEmitter<Consent>();
  @ViewChild('templateSelection') templateSelection!: MatSelect;

  consentTemplates: Map<string, string>;
  localDateFormat:string;
  validFrom:Moment

  constructor(private consentService: ConsentService,
              @Inject(MAT_DATE_LOCALE) private _locale: string) {
    this.consentTemplates = new Map();
    _moment.locale(this._locale);
    this.localDateFormat = _moment().localeData().longDateFormat('L');
    this.validFrom = _moment();
  }

  ngOnInit(): void {
    this.consentService.getConsentTemplateTitleMap()
      .subscribe(r => this.consentTemplates = r);

    //reset selection if no template selected
    if (!this.dataModel?.id && (!this.edit && this.templateSelection)) {
      this.templateSelection.options.forEach((data: MatOption) => data.deselect());
    }
  }

  /**
   * Init data model from the selected consent template
   * @param consentTemplateId
   */
  initDataModel(consentTemplateId: MatSelectChange) {
    this.consentService.getNewConsentDataModel(consentTemplateId.value || "0")
    .subscribe( consentDataModel => {
      this.dataModel = consentDataModel;
      // propagate change to parent component
      this.dataModelChange.emit(this.dataModel)
    });
  }

  /**
   * get default selected consent template from data model
   */
  getSelectedTemplate(): string {
    return this.dataModel?.templateId || "";
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
