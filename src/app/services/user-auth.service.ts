import {Injectable} from '@angular/core';
import {KeycloakEvent, KeycloakEventType, KeycloakService} from "keycloak-angular";
import {SessionService} from "./session.service";
import {mergeMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  isLoggedInKeycloak: boolean = false;

  constructor(
    protected readonly keycloak: KeycloakService,
    protected readonly sessionService: SessionService) {
  }

  notify(event: KeycloakEvent){
    if (event.type == KeycloakEventType.OnAuthLogout) {
      this.isLoggedInKeycloak = false;
    } else if (event.type == KeycloakEventType.OnAuthSuccess) {
      this.isLoggedInKeycloak = true;
    }
  }

  login(redirectUrl: string): Promise<void> {
    // remove old mainzelliste session data if existed, then login with keycloak
    return this.sessionService.deleteSession().pipe(
      mergeMap(r =>
        this.keycloak.login({redirectUri: window.location.origin + redirectUrl})
      )
    ).toPromise()
  }

  logout() {
    return this.keycloak.logout().then( () => this.sessionService.deleteSession().toPromise());
  }

  public getUserName(): string {
    return this.keycloak.getUsername();
  }

  public isLoggedIn(): boolean {
    return this.isLoggedInKeycloak && this.sessionService.isSessionCreated();
  }
}
