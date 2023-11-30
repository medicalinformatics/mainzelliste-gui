import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {Operation, PatientPermissionsContent, Permissions} from "../model/patientlist";
import {UserAuthService} from "./user-auth.service";
import {SinglePermission, PermissionType, Role} from "../model/role";
import {Permission} from "../model/permission";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];
  private readonly configuredRoles: Role[];
  private crudOperations: Operation[] = ["C", "R", "U", "D"];

  constructor(
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = authentication.getRoles();
    this.configuredRoles = this.configService.getRolesWithPermissions()
      .map(e => {
        return new Role(e.name, this.convertConfigPermissions(e.permissions))
      })
  }

  private convertConfigPermissions(configuredPermissions: Permissions): SinglePermission[] {
    let permissions: SinglePermission[] = [];
    if (configuredPermissions.patient != undefined) {
      permissions.push({
        type: 'patient',
        operations: configuredPermissions.patient.operations
      })
      // ids permissions
      permissions.push({
        type: 'ids',
        operations: this.extractOperationsFromPatientPermissionsContent(configuredPermissions.patient.contents?.ids || [])
      })
      // fields permissions
      permissions.push({
        type: 'fields',
        operations: this.extractOperationsFromPatientPermissionsContent(configuredPermissions.patient.contents?.fields || [])
      })
    }

    if (configuredPermissions.consent != undefined) {
      permissions.push({
        type: 'consent',
        operations: configuredPermissions.consent.operations
      })
    }
    return permissions;
  }

  private extractOperationsFromPatientPermissionsContent(permissionsContents: PatientPermissionsContent[]) {
    let operations: Operation[] = []
    for (let permissionsContent of permissionsContents) {
      this.crudOperations.filter(o => permissionsContent.operations.includes(o) && !operations.includes(o))
        .forEach(o => operations.push(o))
      if (operations.length == 4)
        break
    }
    return operations.length == 0 ? this.crudOperations : operations;
  }

  hasPermission(name: PermissionType, type: Operation): boolean {
    console.log("permissionType " + name);
    // return true, if user role not configured in the ui
    if (this.configuredRoles == undefined)
      return true;
    //check permission
    let roles: Role[] = this.configuredRoles.filter(r => this.userRoles.includes(r.name))
    if (roles.length == 0)
      throw new Error(`access denied for ${this.userRoles}`)
    console.log("user permissions", roles)
    return roles.some(role => this.checkPermission(role.permissions, name, type));
  }

  private checkPermission(permissions: SinglePermission[], type: PermissionType, operation: Operation): boolean {
    console.log("user permissions " + type + " type " + operation, permissions)
    return (permissions || []).some(p => p.type == type && p.operations.includes(operation))
  }

  getAllowedIdTypes(operation: Operation): string[] {
    return this.configService.getRolesWithPermissions()
      .filter(r => this.userRoles.includes(r.name))
      .map(r => r.permissions.patient.contents?.ids?.filter( i=> i.operations.includes(operation))
        .map(i => i.type) || [])
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    // return this.configService.getRolesWithPermissions()
    //   .filter(r => this.userRoles.some(ur => ur == r.name))
    //   .map(r => r.permissions.find(p => p.type == permissionName))
    //   .map(p => p?.refined?.idTypes || [])
    //   .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
  }
}
