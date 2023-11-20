import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {PermissionName, Role} from "../model/patientlist";
import {UserAuthService} from "./user-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];

  constructor(
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = authentication.getRoles();
  }

  hasPermission(permissionName: PermissionName) {
    // console.log("user roles " + this.userRoles);
    let roles = this.configService.getRolesWithPermissions()
    // return true, if user role not configured in the ui
    if(roles == undefined)
      return true;
    //check permission
    let role: Role | undefined = roles.find(r => this.userRoles.some(ur => ur == r.name))
    if(role == undefined)
      throw new Error(`access denied for ${this.userRoles}`)
    // console.log("has permission " + (role.permissions || []).some( p => p == permission) + " for " + permission );
    // console.log("user permissions" + role.permissions)
    return (role.permissions || []).some( p => p.name == permissionName);
  }

  getAllowedIdTypes(permissionName: PermissionName): string[] {
    return this.configService.getRolesWithPermissions()
      .filter(r => this.userRoles.some(ur => ur == r.name))
      .map(r => r.permissions.find(p => p.name == permissionName))
      .map(p => p?.refined?.idTypes || [])
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
  }
}
