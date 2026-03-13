import {Component} from '@angular/core';
import {UserAuthService} from "../../services/user-auth.service";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage.service";
import {Tenant} from "../../model/tenant";
import {DateAdapter} from "@angular/material/core";
import { NgIf, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css'],
    imports: [NgIf, MatButton, MatMenuTrigger, MatIcon, MatMenu, NgFor, MatMenuItem, TranslatePipe]
})
export class UserMenuComponent {
  constructor(
    public userAuthService: UserAuthService,
    public translate :TranslateService,
    public authorizationService: AuthorizationService,
    public router: Router,
    private readonly localStorageService :LocalStorageService,
    private readonly dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
  }

  useLanguage(language: string): void {
    this.localStorageService.language = language;
    this.translate.use(language).subscribe();
    this.dateAdapter.setLocale(language);
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
    this.reloadPage();
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
    .then(() => this.router.navigate([this.router.url]));
  }

  getCurrentTenant() {
    return this.authorizationService.getCurrentUITenant();
  }
}
