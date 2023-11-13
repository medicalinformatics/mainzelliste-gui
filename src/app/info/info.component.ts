import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  translate: TranslateService;

  constructor(
    translate: TranslateService,
    private titleService: GlobalTitleService
  ) {
    this.translate = translate;
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
