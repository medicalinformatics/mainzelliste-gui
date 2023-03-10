import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SessionService} from "../services/session.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivateChild {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.sessionService.isAuthenticated().pipe(
      map(isAuthenticated => isAuthenticated ? true : this.router.createUrlTree(
        ['login'], {
          queryParams: {
            url: childRoute.url
          }
        })), catchError((error) => {
        return of(this.router.createUrlTree(['error'], {
          queryParams: {
            status: error.status,
            message: error.error
          }
        }))
      })
    );
  }
}
