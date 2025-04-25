import {MiscellaneousPermission, Operation} from "../tenant";

export interface ClaimsConfig {
  roles: string[],
  permissions: ClaimPermissions
}

export interface ClaimPermissions {
  tenant: ClaimPermissionsTenant,
  resources: ClaimPermissionsResources,
  miscellaneous: MiscellaneousPermission[]
}

export interface ClaimPermissionsTenant {
  id: string,
  name: string,
  idTypes: string[],
  consentTemplateIds: string[]
}

export interface ClaimPermissionsResources {
  patient: PatientPermissionResource,
  consentTemplate: ResourceOperations,
  policySet: ResourceOperations,
  policy : ResourceOperations,
}

export interface PatientPermissionResource {
  operations: Operation[],
  resources: PatientPermissionResources
}

export interface ResourceOperations {
  operations: Operation[]
}

export interface PatientPermissionResources {
  ids: IDPermissions[],
  externalIds: IDPermissions[],
  fields: FieldPermissions[],
  consent: ConsentPermissionResource,
}

export interface ConsentPermissionResource {
  operations: Operation[],
  resources: ConsentPermissionResources
}

export interface ConsentPermissionResources {
  provision: ResourceOperations,
  scans: ResourceOperations,
}

export interface IDPermissions {
  type: string,
  operations: Operation[],
}
export interface FieldPermissions {
  name: string,
  operations: Operation[],
}
