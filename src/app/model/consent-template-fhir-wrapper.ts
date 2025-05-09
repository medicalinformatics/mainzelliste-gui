import {Questionnaire} from "fhir/r4";

export class ConsentTemplateFhirWrapper {

  constructor(
    public id: string,
    public name: string,
    public title: string,
    public definition: Questionnaire,
  ) {
  }
}
