import { Component } from '@angular/core';
import {SessionService} from "../services/session.service";

@Component({
  selector: 'app-user',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  constructor(
    public userService: SessionService
  ) {
  }
}
