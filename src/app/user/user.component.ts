import { Component } from '@angular/core';
import {SessionService} from "../services/session.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor(
    public userService: SessionService
  ) {
  }
}
