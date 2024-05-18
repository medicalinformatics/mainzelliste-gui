import {Component} from '@angular/core';
import {UserAuthService} from "../../services/user-auth.service";
import { TranslateService } from '@ngx-translate/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  constructor(
    public userAuthService: UserAuthService,
    public translate :TranslateService,
    public authorizationService: AuthorizationService,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  getTenants(): { id: string, name: string }[] {
    return this.authorizationService.getTenants();
  }

  setTenant(tenantId: string){
    this.authorizationService.setTenant(tenantId);
    this.router.navigate([`/patientlist`]).then();
  }
}
