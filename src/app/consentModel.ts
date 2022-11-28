import {Questionnaire, Consent} from "fhir/r4";

export interface ConsentModel {
  id?: string;
  title: string;
  date: Date;
  items: ConsentItem[];
  patientId?: { idType: string, idString: string }
  fhirResource?: Consent
  template?: Questionnaire
}

export interface ConsentItem {
  type?:string
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

  constructor(linkId: string, text: string) {
    this.linkId = linkId;
    this.text = text;
  }
}
