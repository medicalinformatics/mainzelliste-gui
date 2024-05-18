export class Tenant {
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

export type PermissionType = "default" | "patient" | "consent" | "ids" | "externalIds" | "fields";

export type Operation = "C" | "R" | "U" | "D";
