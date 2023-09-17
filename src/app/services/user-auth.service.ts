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
      await this.sessionService.deleteSession()
      .pipe( // login in keycloak
        mergeMap(() =>
          this.keycloak.login({redirectUri: window.location.origin + redirectUrl})
        )
      ).toPromise();
    }
    // create new session
    return this.sessionService.createSessionIfNotValid().toPromise();
  }

  async logout() {
    return await this.keycloak.logout().then( () => this.sessionService.deleteSession().toPromise());
  }

  public getUserName(): string {
    return this.keycloak.getUsername();
  }

  public isLoggedIn(): boolean {
    return this.isLoggedInKeycloak && this.sessionService.isSessionCreated();
  }
}
