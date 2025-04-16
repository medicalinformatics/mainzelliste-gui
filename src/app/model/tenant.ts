export class Tenant {
  public static readonly DEFAULT_ID = "default"
  public static readonly ESSENTIAL_MISCELLANEOUS_PERMISSIONS: MiscellaneousPermission[] = ['tt_editConfiguration', 'tt_addPatients',
    'tt_readTentative', 'tt_readTentatives', 'tt_readIdentities']
  constructor(
    public id: string,
    public name: string,
    public roles: string[],
    public idTypes: string[],
    public consentTemplateIds: string[],
    public permissions: TenantPermission[]
  ) {
  }
}

export interface TenantPermission {
  type: PermissionType,
  operations: Operation[],
  miscellaneous?: MiscellaneousPermission
}

export type PermissionType = "default" | "patient" | "consent" | "provision" | "scans" | "consentTemplate" | "ids" | "externalIds" | "fields" | "miscellaneous";

export type Operation = "C" | "R" | "U" | "D";

export type MiscellaneousPermission =
    "createSession"
    | "createToken"
    | "tt_checkMatch"
    | "tt_addPatients"
    | "callback"
    | "redirect"
    | "readAllPatients"
    | "readAllPatientIds"
    | "readAllPatientIdTypes"
    | "readConfiguration"
    | "tt_editConfiguration"
    | "tt_readTentatives"
    | "tt_readTentative"
    | "tt_readIdentities"
    | "manageSessionPatients";
