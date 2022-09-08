import {ControlNumberGenerator} from "./control-number-generator";
import {Field} from "./field";

export class PatientList {
  constructor(
    public url: URL,
    // this needs permission to read the configuration
    public apiKey: string,
    // wenn nicht gesetzt automatisch erste id die von mainzelliste angeben wird
    public mainIdType?: string,
    public fields: Array<Field> = [
      new Field("Vorname", "Vorname", [], true, "", "Max"),
      new Field("Nachname", "Nachname", [], true, "", "Mustermann"),
      new Field("Geburtsname", "Geburtsname",[], true, "", "falls vorhanden"),
      new Field("Geburtsdatum", "", ["Geburtsname", "Geburtstag", "Geburtsmonat"], true, "", "00.00.0000"),
      new Field("Wohnort", "Wohnort",[], true, "", "Musterstadt"),
      new Field("PLZ", "PLZ", [], true, "", "mind. 5 Zeichen")
    ],
    public controlNumberGenerator?: ControlNumberGenerator
  ) {}
}

