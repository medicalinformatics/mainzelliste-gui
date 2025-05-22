import {AfterContentChecked, ChangeDetectorRef, Component} from '@angular/core';
import {GlobalTitleService} from "./services/global-title.service";
import {ErrorNotificationService} from "./services/error-notification.service";
import {NavigationStart, Router} from "@angular/router";
import {Observable} from "rxjs";
import {filter} from 'rxjs/operators';
import {UserAuthService} from "./services/user-auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked {
  title = 'mainzelliste-gui';

  constructor(
    public readonly titleService: GlobalTitleService,
    public readonly errorNotificationService: ErrorNotificationService,
    protected readonly userAuthService: UserAuthService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {
    (router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>).subscribe(() =>
      this.errorNotificationService.clearMessages()
    );
  }

  isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
