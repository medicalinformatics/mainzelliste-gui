import { AssociatedIdsGenerator } from "./associated-ids-generator";
import {Field, FieldType} from "./field";

export class PatientList {
  constructor(
    public url: URL,
    public associatedIdsGenerators: AssociatedIdsGenerator[],
    public oAuthConfig?: OAuthConfig,
    public roles: ConfigRole[] = [],
    public mainIdType?: string,
    public showAllIds?: boolean,
    public fields: Array<Field> = [
      new Field("first_name_text", "Vorname", "vorname", [], FieldType.TEXT, true, "", "Max"),
      new Field("last_name_text", "Nachname", "nachname", [], FieldType.TEXT, true, "", "Mustermann"),
      new Field("birth_name_text", "Geburtsname", "geburtsname",[], FieldType.TEXT, true, "", "falls vorhanden"),
      new Field("birth_date_text", "Geburtdatum", "", ["geburtstag", "geburtsmonat", "geburtsjahr"], FieldType.DATE, true, "", "00.00.0000"),
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

export interface ConfigRole {
  name: string,
  permissions: Permissions;
}
export interface Permissions {
  realm?: Realm
  resources: ResourcesPermissions
}

export interface Realm {
  name: string
  criteria: RealmCriteria
}

export interface RealmCriteria {
  ids: string[]
}

export interface ResourcesPermissions {
  patient: PatientPermissions
  consent: ConsentPermissions
}

export interface PatientPermissions {
  operations: Operation[],
  contents?: PatientPermissionsContents
}

export interface PatientPermissionsContents {
  ids?: PatientPermissionsContent[]
  fields?: PatientPermissionsContent[]
}

export interface PatientPermissionsContent {
  type: string
  operations: Operation[]
}

export interface ConsentPermissions {
  operations: Operation[]
}

export type Operation = "C" | "R" | "U" | "D";

export interface BetaFeatures {
  consent?: boolean;
}

