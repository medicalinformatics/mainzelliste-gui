import {Component} from '@angular/core';
import {UserAuthService} from "../../services/user-auth.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  constructor(
    public userAuthService: UserAuthService,
    public translate :TranslateService
  ) {
    this.translate = translate;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
