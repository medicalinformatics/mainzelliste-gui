import {Component} from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent {

  constructor(
      translate: TranslateService,
      titleService: GlobalTitleService
  ) {
    titleService.setTitle(translate.instant('access_denied.title'), true);
  }
}
