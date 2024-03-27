export interface ClaimsConfig {
  roles: string[],
  permissions: ClaimPermissions
}

export interface ClaimPermissions {
  tenant: ClaimPermissionsTenant,
  resources: ClaimPermissionsResources,
}

export interface ClaimPermissionsTenant {
  id: string,
  name: string,
  idTypes: string[]
}

export interface ClaimPermissionsResources {
  patient: PatientPermissionResource,
  consent: ConsentPermissionResource
}

export interface PatientPermissionResource {
  operations: Operation[],
  resources: PatientPermissionResources
}

export interface ConsentPermissionResource {
  operations: Operation[]
}

export interface PatientPermissionResources {
  ids: IDPermissions[],
  externalIds: IDPermissions[]
  fields: FieldPermissions[]
}

export interface IDPermissions {
  type: string,
  operations: Operation[],
}
export interface FieldPermissions {
  name: string,
  operations: Operation[],
}
