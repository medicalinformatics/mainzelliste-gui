import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {SessionService} from "../services/session.service";
import {Observable} from "rxjs";
import {UserAuthService} from "../services/user-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private sessionService: SessionService,
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
      isSessionCreated => isSessionCreated && this.checkRoles(route.data.roles)
    );
  }

  checkRoles(requiredRoles: any): boolean {
    return !(requiredRoles instanceof Array)
      || requiredRoles.length === 0
      || requiredRoles.every((role) => this.roles.includes(role))
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
