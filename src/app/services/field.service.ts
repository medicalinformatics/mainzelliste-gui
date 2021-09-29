import { Injectable } from '@angular/core';
import {Field} from "../model/field";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Array<Field>
  constructor() {
    this.fields = [
      new Field("Vorname", true, "", "Max"),
      new Field("Nachname", true, "", "Mustermann"),
      new Field("Geburtsname", true, "", "falls vorhanden"),
      new Field("Geburtsdatum", true, "", "00.00.0000"),
      new Field("Wohnort", true, "", "Musterstadt"),
      new Field("PLZ", true, "", "mind. 5 Zeichen")
    ]
  }
  getFields(): Promise<Array<Field>> {
    // TODO: Create proper method to get all fields from a mainzelliste instance
    return new Promise((resolve, reject) => {
      resolve(this.fields);
    });
  }
}
