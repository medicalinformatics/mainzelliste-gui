import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm, NgModel, ValidationErrors} from "@angular/forms";
import {ChoiceItem, ConsentTemplate, DisplayItem, Item, Validity} from "../consent-template.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ConsentService} from "../consent.service";
import {GlobalTitleService} from "../../services/global-title.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
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
    {name: "1.6d", code: "2.16.840.1.113883.3.1937.777.24.2.1790"},
    {name: "1.6f", code:  "2.16.840.1.113883.3.1937.777.24.2.1791"},
    {name: "1.7.2", code:  "2.16.840.1.113883.3.1937.777.24.2.2079"}
  ]

  public templateValidityPeriod: string = this.getValidityPeriodText({day: 0, month: 0, year: 0});
  // MII CS Consent Policy https://simplifier.net/medizininformatikinitiative-modulconsent/2.16.840.1.113883.3.1937.777.24.5.3--20210423105554
  public fhirChoiceItemCodings: fhir4.Coding[] = [
    {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.1",
      display: "Patientendaten erheben, speichern, nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.2",
      display: "IDAT erheben	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.3",
      display: "IDAT speichern, verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.4",
      display: "IDAT zusammenfuehren Dritte	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.5",
      display: "IDAT bereitstellen EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.6",
      display: "MDAT erheben	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.7",
      display: "MDAT speichern, verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.8",
      display: "MDAT wissenschaftlich nutzen EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.9",
      display: "MDAT zusammenfuehren Dritte	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.37",
      display: "Rekontaktierung Ergebnisse erheblicher Bedeutung	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.44",
      display: "Patientendaten retrospektiv verarbeiten, nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.45",
      display: "MDAT retrospektiv speichern verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.46",
      display: "MDAT retrospektiv wissenschaftlich nutzen EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.47",
      display: "MDAT retrospektiv zusammenfuehren Dritte	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.48",
      display: "Patientendaten Weitergabe non DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.49",
      display: "MDAT bereitstellen non EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.10",
      display: "Krankenkassendaten retrospektiv uebertragen, speichern, nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.11",
      display: "KKDAT 5J retrospektiv uebertragen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.12",
      display: "KKDAT 5J retrospektiv speichern verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.13",
      display: "KKDAT 5J retrospektiv wissenschaftlich nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.38",
      display: "KKDAT 5J retrospektiv uebertragen KVNR	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.14",
      display: "KKDAT prospektiv uebertragen speichern nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.15",
      display: "KKDAT 5J prospektiv uebertragen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.16",
      display: "KKDAT 5J prospektiv speichern verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.17",
      display: "KKDAT 5J prospektiv wissenschaftlich nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.39",
      display: "KKDAT 5J prospektiv uebertragen KVNR	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.18",
      display: "Biomaterial erheben, lagern, nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.19",
      display: "BIOMAT erheben	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.20",
      display: "BIOMAT lagern verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.21",
      display: "BIOMAT Eigentum übertragen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.22",
      display: "BIOMAT wissenschaftlich nutzen EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.23",
      display: "BIOMAT Analysedaten zusammenfuehren Dritte	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.24",
      display: "Biomaterial Zusatzentnahme	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.25",
      display: "BIOMAT Zusatzmengen entnehmen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.50",
      display: "Biomaterial retrospektiv speichern, nutzen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.51",
      display: "BIOMAT retrospektiv lagern verarbeiten	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.52",
      display: "BIOMAT retrospektiv wissenschaftlich nutzen EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.53",
      display: "BIOMAT retrospektiv Analysedaten zusammenfuehren Dritte	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.54",
      display: "Biomaterial Weitergabe non EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.55",
      display: "BIOMAT bereitstellen ohne EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.26",
      display: "Rekontaktierung Ergänzungen	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.27",
      display: "Rekontaktierung Verknüpfung Datenbanken	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.28",
      display: "Rekontaktierung weitere Erhebung	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.29",
      display: "Rekontaktierung weitere Studien	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.30",
      display: "Rekontaktierung Zusatzbefund	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.31",
      display: "Rekontaktierung Zusatzbefund	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.32",
      display: "Z1 GECCO83 Nutzung NUM/CODEX	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.40",
      display: "MDAT GECCO83 komplettieren einmalig	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.43",
      display: "MDAT GECCO83 erheben	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.33",
      display: "MDAT GECCO83 bereitstellen NUM/CODEX	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.34",
      display: "MDAT GECCO83 speichern verarbeiten NUM/CODEX	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.41",
      display: "MDAT GECCO83 wissenschaftlich nutzen COVID 19 Forschung EU DSGVO konform	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.42",
      display: "MDAT GECCO83 wissenschaftlich nutzen Pandemie Forschung EU DSGVO konform	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.56",
      display: "MDAT GECCO83 wissenschaftlich nutzen NUM/CODEX EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.35",
      display: "Z1 GECCO83 Weitergabe NUM/CODEX non EU DSGVO NIVEAU	"
    }, {
      system: "urn:oid:2.16.840.1.113883.3.1937.777.24.5.3",
      code: "2.16.840.1.113883.3.1937.777.24.5.3.36",
      display: "MDAT GECCO83 bereitstellen NUM/CODEX ohne EU DSGVO NIVEAU"
    }
  ]
  public consentPolicySets: Map<String, fhir4.Coding[]> = new Map<String, fhir4.Coding[]>();

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
  public currentModule: Item = new DisplayItem(1, 'display');
  constructor(
    public consentService: ConsentService,
    private titleService: GlobalTitleService,
    private validityPeriodDialog: MatDialog,
    private router: Router,
    private translate: TranslateService
  ) {
    this.titleService.setTitle("Einwilligungsvorlage erstellen");
    this.consentPolicySets.set("MiiConsentPolicyValueSet", this.fhirChoiceItemCodings)
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
      return `${this.translate.instant('patientFields.error_value_text1')} ${this.translate.instant('consent_template.' + fieldName )} ${this.translate.instant('patientFields.error_value_text2')}`;
    else if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('consent_template.' + fieldName )} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return "fehler";
  }

  getValidityPeriodText(validityPeriod: Validity){
    return  validityPeriod.year + ' Jahren - ' + validityPeriod.month + ' Monaten - ' + validityPeriod.day  + ' Tagen';
  }

  createModule(selectedModuleType: "choice" | "display") {
    this.template.items = this.template.items || [];
    let item = selectedModuleType == "choice" ?
      new ChoiceItem(this.template.items.length, selectedModuleType, "permit") :
      new DisplayItem(this.template.items.length, selectedModuleType)
    this.template.items.push(item);
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

  dropModule(event: CdkDragDrop<any, any>) {
    moveItemInArray(this.template.items, event.previousIndex, event.currentIndex);
  }

  deleteModule(module: Item) {
    let index = this.template.items.indexOf(module);
    if (index > -1)
      this.template.items.splice(index, 1);
  }

  editModule(m: Item) {
    // clone
    if (m.type == 'choice') {
      this.currentModule = new ChoiceItem(m.id, m.type, "permit")
      this.toChoiceItem(this.currentModule).fhirCoding = this.toChoiceItem(m).fhirCoding;
      this.toChoiceItem(this.currentModule).policySet = this.toChoiceItem(m).policySet;
    } else {
      this.currentModule = new DisplayItem(m.id, m.type);
    }
    this.currentModule.text = m.text;
    // set edit mode
    m.editing = true
    this.currentModule.editing = m.editing;
  }

  isEditingModule(){
    return this.template.items.some(e => e.editing);
  }

  saveEditedModule(m: Item){
    if(!this.currentModule)
      return
    this.toChoiceItem(m).text = this.toChoiceItem(this.currentModule).text;
    this.toChoiceItem(m).editing = false;
    if (m.type == 'choice') {
      this.toChoiceItem(m).fhirCoding = this.toChoiceItem(this.currentModule).fhirCoding;
      this.toChoiceItem(m).policySet = this.toChoiceItem(this.currentModule).policySet;
    }
  }

  cancelEditModule(module: Item){
    module.editing = false;
  }

  getPolicies(module: Item | undefined) {
    if (module == undefined)
      return []
    return this.consentPolicySets.get(this.toChoiceItem(module).policySet || "")?.filter(p =>
      !this.template.items.filter(i => i != module).some(i => i.type == 'choice' && this.toChoiceItem(i).fhirCoding?.code == p.code)
    )
  }

  public toChoiceItem(item: Item): ChoiceItem {
    return item as ChoiceItem;
  }

  public isValid(consentTemplateForm: NgForm): boolean {
    return (!consentTemplateForm.valid  ||
        (!this.template.validity.year || this.template.validity.year <= 0) &&
        (!this.template.validity.month || this.template.validity.month == 0) &&
        (!this.template.validity.day || this.template.validity.day == 0)) ||
      !this.template.items.some(e => e.type == 'choice') ||
      this.template.items.some( e => e.type == 'display' && (e.text == undefined || e.text.trim().length == 0) ||
        e.type == 'choice' && (e as ChoiceItem).fhirCoding == undefined);
  }
}
