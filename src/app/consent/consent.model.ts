import {ConsentValidityPeriod} from "./consent-validity-period";

/**
 * model consent dialog
 */
export class Consent {
  constructor(
    public title: string,
    public createdAt: Date,
    public validityPeriod: ConsentValidityPeriod,
    public items: ConsentItem[],
    public status: ConsentStatus,
    public templateId: string,
    public scans: Map<string, string> = new Map<string, string>(),
    public scanUrls: Map<string, string> = new Map<string, string>(),
    public signature: string,
    public id?: string,
    public version?: string,
    public patientId?: { idType: string, idString: string },
    public fhirResource?: fhir4.Consent,
    public templateFhirResource?: fhir4.Consent
  ) {
  }
  clone(){
    return new Consent(this.title,
      this.createdAt,
      this.validityPeriod,
      this.items.map( i => i instanceof ConsentChoiceItem ?
        new ConsentChoiceItem(i.linkId??"", i.text, i.answer): i),
      this.status,
      this.templateId,
      new Map(this.scans),
      new Map(this.scanUrls),
      this.signature,
      this.id,
      this.version,
      this.patientId,
      this.fhirResource,
      this.templateFhirResource)
  }
}

export interface ConsentsView {
  consentTemplates: Map<string, string>,
  consentRows: ConsentRow[]
}

/**
 * model of a row in a list of consents
 */
export interface ConsentRow {
  id: string,
  templateId: string,
  createdAt: string,
  title: string,
  validityPeriod: string,
  version: number,
  status: string
}

export type ConsentStatus = "draft" | "proposed" | "active" | "rejected" | "inactive" | "entered-in-error";

export interface ConsentHistoryRow {
  id: string,
  lastUpdated: string,
  version: number,
  status: string
}

export interface ConsentItem {
  type?: string
  linkId?: string;
  text: string;
}

export class ConsentDisplayItem implements ConsentItem {
  linkId?: string;
  text: string = "";

  constructor(linkId: string, text: string) {
    this.linkId = linkId;
    this.text = text;
  }
}

export class ConsentChoiceItem implements ConsentItem {
  linkId?: string;
  text: string = "";
  answer: "deny" | "permit" | undefined = "deny";

  constructor(linkId: string, text: string, answer: "deny" | "permit" | undefined) {
    this.linkId = linkId;
    this.text = text;
    this.answer = answer;
  }
}
