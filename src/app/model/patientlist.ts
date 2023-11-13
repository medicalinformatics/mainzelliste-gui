import {Field, FieldType} from "./field";

export class PatientList {
  constructor(
    public url: URL,
    public oAuthConfig?: OAuthConfig,
    public roles: Role[] = [],
    public mainIdType?: string,
    public showAllIds?: boolean,
    public fields: Array<Field> = [
      new Field("first_name_text", "Vorname", "vorname", [], FieldType.TEXT, true, "", "Max"),
      new Field("last_name_text", "Nachname", "nachname", [], FieldType.TEXT, true, "", "Mustermann"),
      new Field("birth_name_text", "Geburtsname", "geburtsname",[], FieldType.TEXT, true, "", "falls vorhanden"),
      new Field("birth_date_text", "Geburtstag", "", ["geburtstag", "geburtsmonat", "geburtsjahr"], FieldType.DATE, true, "", "00.00.0000"),
      new Field("residence_text", "Wohnort", "ort",[], FieldType.TEXT, true, "", "Musterstadt"),
      new Field("zip_code_text", "PLZ", "plz", [], FieldType.TEXT, true, "", "mind. 5 Zeichen")
    ],
    public debug?:boolean,
    public betaFeatures?: BetaFeatures
  ) {}
}

export interface OAuthConfig {
  url?: string;
  realm: string;
  clientId: string;
}

export interface Role {
  name: string,
  permissions: Permission[];
}

export type Permission = "addPatient" | "readPatients" | "editPatient" | "deletePatient" | "addConsent" | "searchConsents" | "readConsent" |  "editConsent";


export interface BetaFeatures {
  consent?: boolean;
}

