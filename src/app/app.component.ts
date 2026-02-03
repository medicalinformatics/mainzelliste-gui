import {AfterContentChecked, ChangeDetectorRef, Component} from '@angular/core';
import {GlobalTitleService} from "./services/global-title.service";
import {ErrorNotificationService} from "./services/error-notification.service";
import { NavigationStart, Router, RouterOutlet } from "@angular/router";
import {Observable} from "rxjs";
import {filter} from 'rxjs/operators';
import {UserAuthService} from "./services/user-auth.service";
import { NgIf } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { HeaderComponent } from './main-layout/header/header.component';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationComponent } from './main-layout/navigation/navigation.component';
import { MatIcon } from '@angular/material/icon';
import { ErrorCardComponent } from './shared/components/error-card/error-card.component';
import { FooterComponent } from './main-layout/footer/footer.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [NgIf, MatProgressBar, HeaderComponent, MatSidenavContainer, MatSidenav, NavigationComponent, MatSidenavContent, MatIcon, ErrorCardComponent, RouterOutlet, FooterComponent]
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
