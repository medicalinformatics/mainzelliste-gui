import {Component} from '@angular/core';
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  constructor(
    public sessionService: SessionService,
    protected readonly keycloak: KeycloakService,
    public router: Router
  ) {
  }

  public logout() {
    this.keycloak.logout();
    this.sessionService.logout();
  }

  public getUserName(): string {
    return this.keycloak.getUsername();
  }
}
