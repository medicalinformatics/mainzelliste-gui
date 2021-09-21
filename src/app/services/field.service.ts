import { Injectable } from '@angular/core';
import {Field} from "../model/field";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Array<Field>
  constructor() {
    this.fields = [
      new Field( "Vorname", true, ""),
      new Field("Nachname", true, ""),
      new Field("Geburtsname", true, ""),
      new Field("Geburtsdatum", true, ""),
      new Field("Wohnort", true, ""),
      new Field("PLZ", true, "")
    ]
  }
  getFields(): Promise<Array<Field>> {
    // TODO: Create proper method to get all fields from a mainzelliste instance
    return new Promise((resolve, reject) => {
      resolve(this.fields);
    });
  }
}
