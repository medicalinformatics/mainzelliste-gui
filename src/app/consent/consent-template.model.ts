export class ConsentTemplate {
  name?: string;
  title?: string;
  status?: string;
  validity: Validity = {month: 0, day: 0};
  organization?: string;
  researchStudy?: string;
  policy?: string
  items: Item[] = [];
}

export interface Item {
  id: number,
  type: ItemType,
  text: string,
  editing: boolean
}

export class DisplayItem implements Item {
  id: number;
  type: ItemType;
  text: string = "";
  editing: boolean = false;

  constructor(
      id: number,
      type: ItemType,
  ) {
    this.id = id;
    this.type = type;
  }
}

export class ChoiceItem implements Item {
  id: number;
  type: ItemType;
  text: string = "";
  editing: boolean = false;
  answer: ChoiceItemAnswer;
  policySet?: string;
  fhirCoding?: fhir4.Coding;

  constructor(
      id: number,
      type: ItemType,
      answer: ChoiceItemAnswer
  ) {
    this.id = id;
    this.type = type;
    this.answer = answer;
  }
}

export type ItemType = "choice" | "display";

export type ChoiceItemAnswer = "deny" | "permit";

export interface Validity {
  day: number,
  month: number,
  year?: number
}
