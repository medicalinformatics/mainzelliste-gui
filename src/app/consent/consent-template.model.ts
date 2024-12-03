import {ConsentPolicySet} from "../model/consent-policy-set";
import {ConsentPolicy} from "../model/consent-policy";

export class ConsentTemplate {
  name?: string;
  version?:string;
  title?: string;
  status: "draft" | "active" | "retired" | "unknown" = "draft";
  validity: Validity = {month: 0, day: 0};
  organization?: string;
  researchStudy?: string;
  policy?: string;
  // if true is "opt in" otherwise "opt-out"
  consentModel: boolean = true;
  items: Item[] = [];
  isMiiFhirConsentConform?: boolean = false;
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
  ) {
    this.id = id;
    this.type = type;
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
  policySet?: ConsentPolicySet;
  policy?: ConsentPolicy;

  constructor(
      id: number,
      type: ItemType,
      answer: ChoiceItemAnswer
  ) {
    this.id = id;
    this.type = type;
    this.answer = answer;
  }

  clone(): ChoiceItem {
    let item = new ChoiceItem(this.id, this.type, this.answer);
    item.text = this.text;
    item.policySet = this.policySet;
    item.policy = this.policy;
    return item;
  }
}

export type ItemType = "choice" | "display";

export type ChoiceItemAnswer = "deny" | "permit";

export interface Validity {
  day: number,
  month: number,
  year?: number
}
