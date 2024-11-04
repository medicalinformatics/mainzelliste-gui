import {Field, FieldType, SemanticType} from "./field";

export class PatientList {
  constructor(
    public url: URL,
    public defaultLanguage: string,
    public oAuthConfig?: OAuthConfig,
    public mainIdType?: string,
    public showAllIds?: boolean,
    public fields: Array<Field> = [
      new Field("first_name_text", "Vorname", "vorname", [], SemanticType.FIRSTNAME, FieldType.TEXT, true, "", "Max"),
      new Field("last_name_text", "Nachname", "nachname", [], SemanticType.LASTNAME, FieldType.TEXT, true, "", "Mustermann"),
      new Field("birth_name_text", "Geburtsname", "geburtsname", [], SemanticType.UNDEFINED , FieldType.TEXT, true, "", "falls vorhanden"),
      new Field("birth_date_text", "Geburtdatum", "", ["geburtstag", "geburtsmonat", "geburtsjahr"],SemanticType.UNDEFINED , FieldType.DATE, true, "", "00.00.0000"),
      new Field("residence_text", "Wohnort", "ort", [], SemanticType.RESIDENCE, FieldType.TEXT, true, "residence", "Musterstadt"),
      new Field("zip_code_text", "PLZ", "plz", [], SemanticType.PLZ, FieldType.TEXT, true, "", "mind. 5 Zeichen")
    ],
    public debug?: boolean,
    public betaFeatures?: BetaFeatures
  ) {}
}

export interface OAuthConfig {
  url?: string;
  realm: string;
  clientId: string;
}

export interface BetaFeatures {
  consent?: boolean;
  copyConcatenatedId?: boolean
  copyId?: boolean
  configuration?:boolean
}

