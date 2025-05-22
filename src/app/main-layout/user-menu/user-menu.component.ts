import {Component} from '@angular/core';
import {UserAuthService} from "../../services/user-auth.service";
import {TranslateService} from '@ngx-translate/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage.service";
import {Tenant} from "../../model/tenant";

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
    public router: Router,
    private localStorageService :LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
  }

  useLanguage(language: string): void {
    this.localStorageService.language = language;
    this.translate.use(language).subscribe();
  }

  getTenants(): { id: string, name: string }[] {
    let tenants: { id: string, name: string }[] = []
    for(let item of this.authorizationService.getUITenants()){
      if(item.id == Tenant.DEFAULT_ID)
        // move "default" tenant to start
        tenants.splice(0, 0, item);
      else
        tenants.push(item)
    }
    return tenants;
  }

  setTenant(tenantId: string){
    this.authorizationService.currentTenantId = tenantId;
    this.router.navigate([`/patientlist`]).then();
  }

  getCurrentTenant() {
    return this.authorizationService.getCurrentUITenant();
  }
}
