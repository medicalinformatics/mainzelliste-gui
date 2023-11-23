import {Component} from '@angular/core';
import {SessionService} from "./services/session.service";
import {GlobalTitleService} from "./services/global-title.service";
import {ErrorNotificationService} from "./services/error-notification.service";
import {NavigationStart, Router} from "@angular/router";
import {Observable} from "rxjs";
import {filter} from 'rxjs/operators';
import {UserAuthService} from "./services/user-auth.service";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mainzelliste-gui';

  constructor(
    translate: TranslateService,
    public readonly sessionService: SessionService,
    public readonly titleService: GlobalTitleService,
    public readonly errorNotificationService: ErrorNotificationService,
    protected readonly userAuthService: UserAuthService,
    public router: Router
  ) {
    translate.addLangs(['en-US', 'de-DE']);
    translate.setDefaultLang('de-DE');
    translate.use('de-DE');
    (router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>).subscribe(() =>
      this.errorNotificationService.clearMessages()
    );
  }

  isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }
}
