import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from "../services/session.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivateChild{

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = this.sessionService.sessionValue;
    if (session.sessionId !== undefined) {
      return true;
    }
    // not logged in so request the apikey from user and try to login
    const usersApiKey = prompt('Please insert your Mainzelliste ApiKey here:');
    if (usersApiKey === null) {
      return this.router.createUrlTree(['error'], {
        queryParams: {
          status: 401,
          message: "You can't login without an apiKey!"
        }
      })
    }
    return this.sessionService.login(usersApiKey).toPromise()
      .then((data) => {
        return true;
      }, (error: HttpErrorResponse) => {
        console.log("Returning navigation to error")
        return this.router.createUrlTree(['error'], {
         queryParams: {
           status: error.status,
           message: error.error
         }
        })
      })
  }

}
