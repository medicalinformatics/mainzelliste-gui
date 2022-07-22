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
      new Field("Vorname", true, "", "Max"),
      new Field("Nachname", true, "", "Mustermann"),
      new Field("Geburtsname", true, "", "falls vorhanden"),
      new Field("Geburtsdatum", true, "", "00.00.0000"),
      new Field("Wohnort", true, "", "Musterstadt"),
      new Field("PLZ", true, "", "mind. 5 Zeichen")
    ],
    public controlNumberGenerator?: ControlNumberGenerator
  ) {}
}

