import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../../services/global-title.service";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import {Permission} from "../../model/permission";
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';
import { IdGeneratorsComponent } from '../idgenerator/id-generators/id-generators.component';
import { PoliciesComponent } from '../policies/policies.component';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css'],
    imports: [MatTabGroup, HasPermissionDirective, MatTab, MatTabContent, IdGeneratorsComponent, PoliciesComponent, TranslatePipe]
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
