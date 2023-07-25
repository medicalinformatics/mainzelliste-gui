import {Component} from '@angular/core';
import {SessionService} from "./services/session.service";
import {GlobalTitleService} from "./services/global-title.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mainzelliste-gui';

  constructor(
    public readonly sessionService: SessionService,
    public readonly titleService: GlobalTitleService
  ) {
  }
}
