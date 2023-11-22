import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {Permission, Role} from "../model/patientlist";
import {UserAuthService} from "./user-auth.service";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = authentication.getRoles();
  }

  hasPermission(permission: Permission) {
    // console.log("user roles " + this.userRoles);
    let permissions = this.configService.getRolesWithPermissions()
    // return true, if user role not configured in the ui
    if(permissions == undefined)
      return true;
    //check permission
    let role: Role | undefined = permissions.find(r => this.userRoles.some(ur => ur == r.name))
    if(role == undefined)
      throw new Error(this.translate.instant('error.authorization_service') + `${this.userRoles}`)
    // console.log("has permission " + (role.permissions || []).some( p => p == permission) + " for " + permission );
    // console.log("user permissions" + role.permissions)
    return (role.permissions || []).some( p => p == permission);

  }
}
