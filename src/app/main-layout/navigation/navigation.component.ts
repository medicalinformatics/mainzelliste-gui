import {Component} from '@angular/core';
import {Permission} from "../../model/permission";
import {AppConfigService} from "../../app-config.service";
import {AuthorizationService} from "../../services/authorization.service";
import {PatientListService} from "../../services/patient-list.service";
import {HasPermissionDirective} from '../../shared/directives/has-permission.directive';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    imports: [HasPermissionDirective, MatButton, RouterLink, MatIcon, NgIf, MatDivider, TranslatePipe]
})
export class NavigationComponent {

  public readonly Permission = Permission;

  constructor(
      public appConfigService: AppConfigService,
      public authorizationService:AuthorizationService,
      public patientListService:PatientListService
  ) {
  }
}

