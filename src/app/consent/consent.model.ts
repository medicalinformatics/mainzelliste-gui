import {Questionnaire} from "fhir/r4";
import {Moment} from "moment/moment";

export class Consent {
  constructor(
    public title: string,
    public createdAt: Date,
    public period: number,
    public items: ConsentItem[],
    public status: ConsentStatus,
    public templateId: string,
    public id?: string,
    public version?: string,
    public validFrom?: Moment,
    public validUntil?: Date,
    public patientId?: { idType: string, idString: string },
    public fhirResource?: fhir4.Consent,
    public template?: Questionnaire
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
