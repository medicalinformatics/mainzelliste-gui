import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {Observable, of} from "rxjs";
import {UserAuthService} from "../services/user-auth.service";
import {AuthorizationService} from "../services/authorization.service";
import {Permission} from "../model/patientlist";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private authorizationService: AuthorizationService,
    private userAuthService: UserAuthService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.userAuthService.login(this.authenticated, state.url)
    .then(
      isSessionCreated => isSessionCreated && this.checkPermission(route.data.permission)
    );
  }

  checkPermission(permission: Permission): boolean | UrlTree {
    return permission == undefined || this.authorizationService.hasPermission(permission) || this.router.createUrlTree(['access-denied']);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
