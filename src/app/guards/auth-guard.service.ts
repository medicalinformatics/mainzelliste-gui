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
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
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
    // force authentication.
    if (!this.authenticated) {
      await this.userAuthService.login(state.url);
    }

    return this.sessionService.isSessionValid().pipe(
      mergeMap((isSessionValid) => isSessionValid ? of(true)
        : this.sessionService.createSession().pipe(map(() => true))
      ),
      catchError((error) => {
        error.message = "internal System Error : " + error.message;
        if (error.status == 400 || error.status == 401) {
          error.message = "auth failed, try again " + error.message;
        }
        return of(this.router.createUrlTree(['error'], {
          queryParams: {
            status: error.status,
            message: error.message
          }
        }))
      }),
      map(sessionCreated => {
          // check roles
          const requiredRoles = route.data.roles;
          return sessionCreated && (!(requiredRoles instanceof Array)
            || requiredRoles.length === 0
            || requiredRoles.every((role) => this.roles.includes(role)));
        }
      )
    ).toPromise();
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
