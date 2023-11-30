import {Component} from '@angular/core';
import {Permission} from "../../model/permission";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  public readonly Permission = Permission;

  constructor() {
  }
}

