import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {Operation, PatientPermissionsContent, Realm, ResourcesPermissions} from "../model/patientlist";
import {UserAuthService} from "./user-auth.service";
import {TranslateService} from '@ngx-translate/core';
import {RealmIdFilter, Role, SinglePermission} from "../model/role";
import {Permission} from "../model/permission";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];
  private readonly configuredRoles: Role[];
  private crudOperations: Operation[] = ["C", "R", "U", "D"];

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = authentication.getRoles();
    this.configuredRoles = this.configService.getRolesWithPermissions()
      .map(e => {
        return new Role(e.name, this.convertRealm(e.permissions.realm), this.convertConfigPermissions(e.permissions.resources))
      })
  }

  private convertRealm(realm: Realm | undefined): RealmIdFilter {
    return {idTypes: (realm?.criteria.ids || [])};
  }

  private convertConfigPermissions(configuredPermissions: ResourcesPermissions): SinglePermission[] {
    let permissions: SinglePermission[] = [];
    if (configuredPermissions.patient != undefined) {
      permissions.push({
        type: 'patient',
        operations: configuredPermissions.patient.operations
      })
      // ids permissions
      permissions.push({
        type: 'ids',
        operations: this.extractOperationsFromPatientPermissionsContent(configuredPermissions.patient.contents?.ids || [],
          configuredPermissions.patient.operations)
      })
      // fields permissions
      permissions.push({
        type: 'fields',
        operations: this.extractOperationsFromPatientPermissionsContent(configuredPermissions.patient.contents?.fields || [],
          configuredPermissions.patient.operations)
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

  private extractOperationsFromPatientPermissionsContent(permissionsContents: PatientPermissionsContent[],
                                                         patientOperations: Operation[] ) {
    let operations: Operation[] = []
    for (let permissionsContent of permissionsContents) {
      this.crudOperations.filter(o => permissionsContent.operations.includes(o) && !operations.includes(o))
        .forEach(o => operations.push(o))
      if (operations.length == 4)
        break
    }
    return operations.length == 0 ? patientOperations : operations;
  }

  hasPermission(permission: Permission): boolean {
    return this.hasAnyPermissions([permission]);
  }

  hasAnyPermissions(permissions: Permission[]): boolean {
    // return true, if user role not configured in the ui
    if (this.configuredRoles == undefined)
      return true;
    //check permission
    let roles: Role[] = this.configuredRoles.filter(r => this.userRoles.includes(r.name))
    if (roles.length == 0)
      throw new Error(this.translate.instant('error.authorization_service') + `${this.userRoles}`)
    return roles.some(role => permissions.some( p => this.checkPermission(role.permissions, p)));
  }

  private checkPermission(permissions: SinglePermission[], permission: Permission): boolean {
    return (permissions || []).some(p => p.type == permission.type
      && p.operations.includes(permission.operation))
  }

  getAllowedIdTypes(operation: Operation): string[] {
    return this.configService.getRolesWithPermissions()
      .filter(r => this.userRoles.includes(r.name))
      .map(r => r.permissions.resources.patient.contents?.ids?.filter( i=> i.operations.includes(operation))
        .map(i => i.type) || [])
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }

  getRealmIdTypes(): string[] {
    return this.configuredRoles.filter(r => this.userRoles.includes(r.name))
      .map(r => r.realmFilter.idTypes)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }
}
