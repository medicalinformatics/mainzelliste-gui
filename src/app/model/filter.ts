import {Patient} from "./patient";

export class Filter {

  constructor(
    public searchOperation: "searchField" | "similarPatient",
  ) {

  }
}

export class FieldFilter extends Filter {
  constructor(
    public searchField: { name: string, value: string }
  ){
    super("searchField")
  }
  public toString(){
    return this.searchField.name + ": " + this.searchField.value;
  }
}

export class SimilarPatientFilter extends Filter {
  constructor(
    public searchPatient: Patient
  ){
    super("similarPatient")
  }

  public toString() {
    return "similiarPatient: " + this.searchPatient.ids[0].idString;
  }
}
