import { Component } from '@angular/core';
import {SessionService} from "../services/session.service";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  constructor(
    public sessionService: SessionService
  ) {
  }
}
