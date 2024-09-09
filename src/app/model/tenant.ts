export class Tenant {
  public static DEFAULT_ID = "default"

  constructor(
    public id: string,
    public name: string,
    public roles: string[],
    public idTypes: string[],
    public permissions: TenantPermission[]
  ) {
  }
}

export interface TenantPermission {
  type: PermissionType,
  operations: Operation[]
}

export type PermissionType = "default" | "patient" | "consent" | "provision" | "scans" | "consentTemplate" | "ids" | "externalIds" | "fields";

export type Operation = "C" | "R" | "U" | "D";
