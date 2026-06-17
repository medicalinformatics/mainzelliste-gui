import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css'],
    imports: [TranslatePipe]
})
export class InfoComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private titleService: GlobalTitleService
  ) {
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('info.title'));
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })
  }

}
