import {Field, FieldType, SemanticType} from "./field";

export class PatientList {
  public static defaultFenderFieldValues: GenderValue[] = [
    {  id: "male", value: "m", i18n: "sex_male_text" },
    {  id: "female", value: "f", i18n: "sex_female_text" },
    {  id: "other", value: "o", i18n: "sex_other_text" },
    {  id: "unknown", value: "u", i18n: "sex_unknown_text" },
  ]
  constructor(
    public url: URL,
    public defaultLanguage: string,
    public oAuthConfig?: OAuthConfig,
    public mainIdType?: string,
    public showAllIds?: boolean,
    public fields: Array<Field> = [
      new Field("first_name_text", "Vorname", "vorname", [], SemanticType.FIRSTNAME, FieldType.TEXT, true, "", "Max"),
      new Field("last_name_text", "Nachname", "nachname", [], SemanticType.LASTNAME, FieldType.TEXT, true, "", "Mustermann"),
      new Field("birth_name_text", "Geburtsname", "geburtsname", [], SemanticType.BIRTH_NAME , FieldType.TEXT, true, "", "falls vorhanden"),
      new Field("birth_date_text", "Geburtdatum", "", ["geburtstag", "geburtsmonat", "geburtsjahr"], SemanticType.UNDEFINED , FieldType.DATE, true, "", "00.00.0000"),
      new Field("sex_text", "Geschlecht", "sex", [], SemanticType.SEX, FieldType.SEX, false, "", "Geschlecht"),
      new Field("residence_text", "Wohnort", "ort", [], SemanticType.CITY, FieldType.TEXT, true, "", "Musterstadt"),
      new Field("zip_code_text", "PLZ", "plz", [], SemanticType.POSTAL_CODE, FieldType.TEXT, true, "", "mind. 5 Zeichen")
    ],
    public genderFieldValues: GenderValue[] = PatientList.defaultFenderFieldValues,
    public layout?: Layout,
    public debug?: boolean,
    public betaFeatures?: BetaFeatures
  ) {}
}

export interface GenderValue {
  id: string,
  value: string,
  i18n: string
}

export interface Layout{
  footerLogos?: FooterLogo[]
}
export interface FooterLogo {
  id: string
}

export interface OAuthConfig {
  url?: string;
  realm: string;
  clientId: string;
}

export interface BetaFeatures {
  copyConcatenatedId?: boolean
  copyConcatenateSeparation?: string
  copyId?: boolean
  configuration?:boolean
  showDomainsInIDCard?:boolean
  disableBulkIdGeneration?:boolean
  disableIdSelection?:boolean
  onkostarUrl?:string
}
