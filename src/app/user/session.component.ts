import {Component} from '@angular/core';
import {UserAuthService} from "../services/user-auth.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
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
