import {Operation} from "./patientlist";

export class Role {
  constructor(
    public name: string,
    public permissions: SinglePermission[]
  ) {
  }
}


export interface SinglePermission {
  type: PermissionType,
  operations: Operation[]
}

export type PermissionType = "patient" | "consent" | "ids" | "fields";
