import {Injectable} from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {Observable} from "rxjs";
import {UserAuthService} from "../services/user-auth.service";
import {AuthorizationService} from "../services/authorization.service";
import {Permission} from "../model/permission";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild {
  constructor(
    protected readonly router: Router,
    protected readonly activatedRouter: ActivatedRoute,
    protected readonly keycloak: KeycloakService,
    private authorizationService: AuthorizationService,
    private userAuthService: UserAuthService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.userAuthService.login(this.authenticated, state.url).then( a => {
    console.log("login " + a); return a}) || this.router.createUrlTree(['access-denied']);
  }

  checkPermission(permission: Permission): boolean | UrlTree {
    return permission == undefined || this.authorizationService.hasPermission(permission)
      || this.router.createUrlTree(['access-denied']);
  }

  checkAnyPermissions(permissions: Permission[]): boolean | UrlTree {
    return permissions == undefined || permissions.length == 0  || this.authorizationService.hasAnyPermissions(permissions)
      || this.router.createUrlTree(['access-denied']);
  }

  checkTenantIdType(urlSegments: UrlSegment[]): boolean | UrlTree {
    return urlSegments == undefined || urlSegments.length < 2
      || this.authorizationService.getRealmIdTypes().includes(urlSegments[1].path)
      || this.router.createUrlTree(['access-denied']);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("canActivateChild")
    return this.checkPermission(childRoute.data.permission) &&
      this.checkAnyPermissions(childRoute.data.anyPermissions) &&
      (!childRoute.data.checkIdType || this.checkTenantIdType(childRoute.url));
  }
}
