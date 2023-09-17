import {Component} from '@angular/core';
import {UserAuthService} from "../services/user-auth.service";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  constructor(
    public userAuthService: UserAuthService
  ) {
  }
}
