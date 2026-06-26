import {Component} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {GlobalTitleService} from "../services/global-title.service";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-failed-authentication',
  imports: [
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './failed-authentication.component.html',
  styleUrl: './failed-authentication.component.css'
})
export class FailedAuthenticationComponent {
  constructor(
    translate: TranslateService,
    titleService: GlobalTitleService
  ) {
    titleService.setTitle(translate.instant('auth_failed.title'), true);
  }
}
