import {Operation} from "./patientlist";

export class Role {
  constructor(
    public name: string,
    public realmFilter: RealmIdFilter,
    public permissions: SinglePermission[]
  ) {
  }
}

export interface RealmIdFilter {
  idTypes: string[]
}

export interface SinglePermission {
  type: PermissionType,
  operations: Operation[]
}

export type PermissionType = "patient" | "consent" | "consentTemplate" | "ids" | "fields";
