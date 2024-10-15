import {Injectable} from '@angular/core';
import {KeycloakEvent, KeycloakEventType, KeycloakService} from "keycloak-angular";
import {SessionService} from "./session.service";
import {mergeMap} from "rxjs/operators";
import {firstValueFrom, lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  isLoggedInKeycloak: boolean = false;

  constructor(
    protected readonly keycloak: KeycloakService,
    protected readonly sessionService: SessionService) {
  }

  notifyKeycloakEvent(event: KeycloakEvent){
    if (event.type == KeycloakEventType.OnAuthLogout) {
      this.isLoggedInKeycloak = false;
    } else if (event.type == KeycloakEventType.OnAuthSuccess) {
      this.isLoggedInKeycloak = true;
    }
  }

  async retryLogin(redirectUrl: string){
    let authenticated = await this.keycloak.isLoggedIn();
    return this.login(authenticated, redirectUrl);
  }

  async login(authenticated: boolean, redirectUrl: string): Promise<boolean> {
    if (!authenticated) {
      // delete old session
      await lastValueFrom(this.sessionService.deleteSession()
      .pipe( // login in keycloak
        mergeMap(() =>
          this.keycloak.login({redirectUri: window.location.origin + redirectUrl})
        )
      ));
    }
    // create new session
    return lastValueFrom(this.sessionService.createSessionIfNotValid());
  }

  async logout() {
    return await this.keycloak.logout().then( () => {
      firstValueFrom(this.sessionService.deleteSession());
      this.keycloak.clearToken();
    });
  }

  public getUserName(): string {
    return this.keycloak.getUsername();
  }

  public isLoggedIn(): boolean {
    return this.isLoggedInKeycloak && this.sessionService.isSessionCreated();
  }

  getRoles() {
    return this.keycloak.getUserRoles(true);
  }
}
