import {Questionnaire} from "fhir/r4";

export class Consent {
  constructor(
    public title: string,
    public createdAt: Date,
    public period: number,
    public items: ConsentItem[],
    public status: ConsentStatus,
    public id?: string,
    public version?: string,
    public validFrom?: Date,
    public validUntil?: Date,
    public patientId?: { idType: string, idString: string },
    public fhirResource?: fhir4.Consent,
    public templateName?: string,
    public template?: Questionnaire,
  ) {
  }
}

export type ConsentStatus = "draft" | "proposed" | "active" | "rejected" | "inactive" | "entered-in-error";

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
