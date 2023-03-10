import {Component} from '@angular/core';
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  constructor(
    public sessionService: SessionService,
    public router: Router
  ) {
  }

  public logout (){
    this.sessionService.logout();
    this.router.navigate(['login'])
  }
}
