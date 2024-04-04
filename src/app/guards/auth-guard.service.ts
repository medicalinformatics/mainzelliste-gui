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
    return this.userAuthService.login(this.authenticated, state.url).then() || this.router.createUrlTree(['access-denied']);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let accessGranted = false;
    if(childRoute.data.permission != undefined)
      accessGranted =  this.authorizationService.hasPermission(childRoute.data.permission);
    else if(childRoute.data.anyPermissions != undefined && childRoute.data.anyPermissions.length > 0)
      accessGranted =  this.authorizationService.hasAnyPermissions(childRoute.data.anyPermissions);
    if(!accessGranted)
      return this.router.createUrlTree(['access-denied']);

    return !childRoute.data.checkIdType || this.checkTenantIdType(childRoute.url);
  }

  checkTenantIdType(urlSegments: UrlSegment[]): boolean | UrlTree {
    return urlSegments == undefined || urlSegments.length < 2
      || this.authorizationService.getTenantIdTypes().includes(urlSegments[1].path)
      || this.router.createUrlTree(['access-denied']);
  }
}
