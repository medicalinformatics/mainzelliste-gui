import {ControlNumberGenerator} from "./control-number-generator";
// currently only this fields are supported,
// TODO look into support for other fields

export type fieldIndex = string;
 const firstName = "FIRST_NAME";
 // |"LAST_NAME"| "BIRTHDAY"| "BIRTHMONTH"| "BIRTHYEAR"| "BIRTHNAME" | "ZIP"| "RESIDENCE";


export class PatientList {


  constructor(
    public url: URL,
    // this needs permission to read the configuration
    public apiKey: string,
    public controlNumberGenerator?: ControlNumberGenerator,
  // wenn nicht gesetzt automatisch erste id die von mainzelliste angeben wird
    public mainIdType?: string,

  // von gui auf mainzelliste backend

  // TODO check how to express optional fields
 /* public fieldMappings: {
    [key in fieldIndex]: string;
  } = {
    FIRST_NAME: "Vorname",
    LAST_NAME: "Nachname",
    BIRTHDAY: "Geburtstag",
    BIRTHMONTH: "Geburtsmonat",
    BIRTHYEAR: "Geburtsjahr",
    BIRTHNAME: "Geburtsname",
    ZIP: "PLZ",
    RESIDENCE: "Wohnort"
  }*/
) {
  }
}

