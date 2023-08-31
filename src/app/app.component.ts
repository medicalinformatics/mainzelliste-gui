import {Component} from '@angular/core';
import {SessionService} from "./services/session.service";
import {GlobalTitleService} from "./services/global-title.service";
import {ErrorNotificationService} from "./services/error-notification.service";
import {NavigationStart, Router} from "@angular/router";
import {Observable} from "rxjs";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mainzelliste-gui';

  constructor(
    public readonly sessionService: SessionService,
    public readonly titleService: GlobalTitleService,
    public readonly errorNotificationService: ErrorNotificationService,
    public router: Router
  ) {
    (router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>).subscribe(() =>
      this.errorNotificationService.clearMessages()
    );
  }
}
