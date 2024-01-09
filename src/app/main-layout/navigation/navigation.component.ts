import {Component} from '@angular/core';
import {Permission} from "../../model/permission";
import {AppConfigService} from "../../app-config.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  public readonly Permission = Permission;

  constructor(
      public appConfigService: AppConfigService
  ) {
  }
}

