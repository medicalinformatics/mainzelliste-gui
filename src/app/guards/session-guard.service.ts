import {Injectable} from '@angular/core';
import {CanActivateChild, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SessionService} from "../services/session.service";
import {catchError, map, mergeMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivateChild {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.sessionService.isSessionValid().pipe(
      mergeMap((isSessionValid) => isSessionValid ? of(true)
        : this.sessionService.login().pipe(map(() => true))
      ),
      catchError((error) => {
        if (error.status == 400 || error.status == 401) {
          error.message = "auth failed, try again " + error.message;
        } else {
          error.message = "internal System Error : " + error.message;
        }
        return of(this.router.createUrlTree(['error'], {
          queryParams: {
            status: error.status,
            message: error.message
          }
        }))
      })
    );
  }
}
