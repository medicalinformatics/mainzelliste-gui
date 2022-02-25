import { Injectable } from '@angular/core';
import {Field} from "../model/field";
import {AppConfigService} from "../app-config.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Array<Field> = [];

  constructor( ) { /*hugo: AppConfigService*/

    this.fields = [
      new Field("Vorname", true, "", "Max"),
      new Field("Nachname", true, "", "Mustermann"),
      new Field("Geburtsname", true, "", "falls vorhanden"),
      new Field("Geburtsdatum", true, "", "00.00.0000"),
      new Field("Wohnort", true, "", "Musterstadt"),
      new Field("PLZ", true, "", "mind. 5 Zeichen")
    ]

    /*let fieldMappings = hugo.data[0].fieldMappings;

    for (let key in fieldMappings) {
        if(fieldMappings[key] != undefined){
        this.fields.push(new Field(fieldMappings[key], false, "", "falls vorhanden"));
        }
    }
    if(fieldMappings["BIRTHNAME"]!= undefined){
      this.fields.push(new Field(fieldMappings["BIRTHNAME"], false, "", "falls vorhanden"));
    }*/
   /* if(hugo.data[0].fieldMappings["RESIDENCE"]!= undefined){
      new Field(hugo.data[0].fieldMappings["RESIDENCE"], false, "", "falls vorhanden");
    }
    if(hugo.data[0].fieldMappings["ZIP"]!= undefined){
      new Field(hugo.data[0].fieldMappings["ZIP"], false, "", "falls vorhanden");
    }*/
  }

  getFields(): Promise<Array<Field>> {
    // TODO: Create proper method to get all fields from a mainzelliste instance
    return new Promise((resolve, reject) => {
      resolve(this.fields);
    });
  }
}
