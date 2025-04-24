import {ConsentPolicySet} from "../model/consent-policy-set";
import {Validity} from "./consent-validity-period";

export class ConsentTemplate {
  name?: string;
  version?:string;
  title?: string;
  status: "draft" | "active" | "retired" | "unknown" = "draft";
  validity: Validity = {month: 0, day: 0, year: 0};
  organization?: string;
  researchStudy?: string;
  policy?: string;
  // if true is "opt in" otherwise "opt-out"
  consentModel: boolean = true;
  items: Item[] = [];
  isMiiFhirConsentConform?: boolean = false;

  static createEmpty():ConsentTemplate {
    return {
      items: [],
      validity: {day: 0, month: 0, year: 0},
      status: "draft",
      policy: "urn:oid:2.16.840.1.113883.3.1937.777.24.2.1790",
      consentModel: true
    }
  }
}

export interface Item {
  id: number,
  type: ItemType,
  text: string,
  clone():Item;
}

export class DisplayItem implements Item {
  id: number;
  type: ItemType;
  text: string = "";

  constructor(
      id: number,
      type: ItemType,
      text?: string
  ) {
    this.id = id;
    this.type = type;
    this.text = text ?? "";
  }

  clone(): DisplayItem {
    let item = new DisplayItem(this.id, this.type);
    item.text = this.text;
    return item;
  }
}

export class ChoiceItem implements Item {
  id: number;
  type: ItemType;
  text: string = "";
  answer: ChoiceItemAnswer;
  policies?: PolicyView[] = [];

  constructor(
      id: number,
      type: ItemType,
      answer: ChoiceItemAnswer,
      text?: string,
      policies?: PolicyView[]
  ) {
    this.id = id;
    this.type = type;
    this.answer = answer;
    this.text = text ?? "";
    this.policies =  policies ?? [];
  }

  clone(): ChoiceItem {
    let item = new ChoiceItem(this.id, this.type, this.answer);
    item.text = this.text;
    item.policies = this.policies?.map(p => p);
    return item;
  }
}

export type ItemType = "choice" | "display";

export type ChoiceItemAnswer = "deny" | "permit";

export interface PolicyView {
  policySet: ConsentPolicySet,
  displayText: string,
  code: string,
  validity: Validity
}
