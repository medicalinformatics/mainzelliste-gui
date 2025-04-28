import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../../services/global-title.service";
import {TranslateService} from "@ngx-translate/core";
import {Permission} from "../../model/permission";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  protected readonly Permission = Permission;

  constructor(
    public translate: TranslateService,
    private titleService: GlobalTitleService
  ) {
    this.changeTitle()
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })
  }
  changeTitle() {
    this.titleService.setTitle(this.translate.instant('navigation.configuration'));
  }
}
