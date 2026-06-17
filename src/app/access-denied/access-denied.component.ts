import {Component} from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.css'],
    imports: [MatIcon, TranslatePipe]
})
export class AccessDeniedComponent {

  constructor(
      translate: TranslateService,
      titleService: GlobalTitleService
  ) {
    titleService.setTitle(translate.instant('access_denied.title'), true);
  }
}
