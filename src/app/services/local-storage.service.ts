import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {AuthorizationService} from "./authorization.service";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static readonly LS_LANG: string = "mainzellisteUILanguage"
  static readonly LS_TENANT_ID: string = "mainzellisteUITenant"

  private readonly supportedLanguages: string[] = ['de-DE', 'en-US']

  private currentLanguage: BehaviorSubject<string>;
  private currentTenantId: BehaviorSubject<string>;

  constructor(
    private translate: TranslateService
  ) {
    this.currentLanguage = this.loadLanguage();
    this.currentTenantId = this.loadTenant();
  }

  loadLanguage(): BehaviorSubject<string> {
    const cachedLanguage: string | null = localStorage.getItem(LocalStorageService.LS_LANG);
    return new BehaviorSubject<string>(
      cachedLanguage !== null && this.supportedLanguages.some(l => l == cachedLanguage) ?
        cachedLanguage : this.translate.getDefaultLang());
  }

  loadTenant(): BehaviorSubject<string> {
    const cachedTenantId: string | null = localStorage.getItem(LocalStorageService.LS_TENANT_ID);
    return new BehaviorSubject<string>(cachedTenantId ?? "");
  }

  public get language(): string {
    return this.currentLanguage.value
  }

  public set language(lang: string) {
    localStorage.setItem(LocalStorageService.LS_LANG, lang);
    this.currentLanguage.next(lang);
  }

  public get tenantId(): string {
    return this.currentTenantId.value
  }

  public set tenantId(tenantId: string) {
    localStorage.setItem(LocalStorageService.LS_TENANT_ID, tenantId);
    this.currentTenantId.next(tenantId);
  }
}
