import {effect, inject, Injectable, Signal} from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEvent,
  KeycloakEventType, ReadyArgs,
  typeEventArgs
} from "keycloak-angular";
import Keycloak from 'keycloak-js';
import {SessionService} from "./session.service";
import {mergeMap} from "rxjs/operators";
import {firstValueFrom, lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  isLoggedInKeycloak: boolean = false;
  private readonly keycloakSignal: Signal<KeycloakEvent>;
  private readonly keycloak: Keycloak;

  constructor(
    protected readonly sessionService: SessionService) {
    this.keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
    this.keycloak = inject(Keycloak);

    // listen to keycloak event
    effect(() => {
      const event =  this.keycloakSignal();
      if (event.type == KeycloakEventType.AuthLogout) {
        this.isLoggedInKeycloak = false;
      } else if (event.type == KeycloakEventType.AuthSuccess
        || event.type == KeycloakEventType.Ready && typeEventArgs<ReadyArgs>(event.args)) {
        this.isLoggedInKeycloak = true;
      }
    });
  }

  async retryLogin(redirectUrl: string){
    return this.login(this.keycloak.authenticated, redirectUrl);
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

  getUserName() {
    return this.keycloak.profile?.username ?? "";
  }
  public isLoggedIn(): boolean {
    return this.isLoggedInKeycloak && this.sessionService.isSessionCreated();
  }

  getRoles() {
    let roles: string[] = [];

    if (this.keycloak.resourceAccess) {
      roles = Object.values(this.keycloak.resourceAccess)
      .map(roles => roles['roles'] || [])
      .flat();

      const realmRoles = this.keycloak.realmAccess?.roles || [];
      roles.push(...realmRoles);
    }

    return roles;
  }
}
