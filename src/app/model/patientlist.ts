import {ControlNumberGenerator} from "./control-number-generator";
import {Field, FieldType} from "./field";

export class PatientList {
  constructor(
    public url: URL,
    public oAuthConfig?: OAuthConfig,
    // wenn nicht gesetzt automatisch erste id die von mainzelliste angeben wird
    public mainIdType?: string,
    public showAllIds?: boolean,
    public fields: Array<Field> = [
      new Field("Vorname", "Vorname", [], FieldType.TEXT, true, "", "Max"),
      new Field("Nachname", "Nachname", [], FieldType.TEXT, true, "", "Mustermann"),
      new Field("Geburtsname", "Geburtsname",[], FieldType.TEXT, true, "", "falls vorhanden"),
      new Field("Geburtsdatum", "", ["Geburtstag", "Geburtsmonat", "Geburtsjahr"], FieldType.DATE, true, "", "00.00.0000"),
      new Field("Wohnort", "Wohnort",[], FieldType.TEXT, true, "", "Musterstadt"),
      new Field("PLZ", "PLZ", [], FieldType.TEXT, true, "", "mind. 5 Zeichen")
    ],
    public controlNumberGenerator?: ControlNumberGenerator,
    public debug?:boolean
  ) {}
}

export interface OAuthConfig {
  url?: string;
  realm: string;
  clientId: string;
}

