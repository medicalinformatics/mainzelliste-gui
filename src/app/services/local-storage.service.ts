import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static readonly LS_LANG: string = "mainzellisteUILanguage"
  static readonly LS_TENANT_ID: string = "mainzellisteUITenant"
  static readonly LS_PATIENT_LIST_COLUMNS: string = "mainzellisteUIPatientListColumns"

  private readonly supportedLanguages: string[] = ['de-DE', 'en-US']

  private currentLanguage: BehaviorSubject<string>;
  private currentTenantId: BehaviorSubject<string>;
  private currentPatientListColumns: BehaviorSubject<Map<string,string[]>>;

  constructor(
    private translate: TranslateService
  ) {
    this.currentLanguage = this.loadLanguage();
    this.currentTenantId = this.loadTenant();
    this.currentPatientListColumns = this.loadPatientListColumns()
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

  loadPatientListColumns(): BehaviorSubject<Map<string, string[]>> {
    // parse stored value
    const cachedPatientListColumns: string | null = localStorage.getItem(LocalStorageService.LS_PATIENT_LIST_COLUMNS);
    if(cachedPatientListColumns != undefined) {
      const result = JSON.parse(cachedPatientListColumns);
      if(result instanceof Array){
        return new BehaviorSubject<Map<string, string[]>>(new Map<string, string[]>(result));
      }
    }
    return new BehaviorSubject<Map<string, string[]>>(new Map<string, string[]>());
  }

  public get language(): string {
    return this.currentLanguage.value
  }

  public set language(lang: string) {
    localStorage.setItem(LocalStorageService.LS_LANG, lang);
    this.currentLanguage.next(lang);
  }

  public get patientListColumns(): string[] {
    return this.currentPatientListColumns.value.get(this.tenantId) || [];
  }

  public set patientListColumns(patientListColumns: string[]) {
    let currentValue = this.currentPatientListColumns.value;
    currentValue.set(this.tenantId, patientListColumns);
    localStorage.setItem(LocalStorageService.LS_PATIENT_LIST_COLUMNS, JSON.stringify([... currentValue.entries()]));
    this.currentPatientListColumns.next(currentValue);
  }

  public get tenantId(): string {
    return this.currentTenantId.value
  }

  public set tenantId(tenantId: string) {
    localStorage.setItem(LocalStorageService.LS_TENANT_ID, tenantId);
    this.currentTenantId.next(tenantId);
  }
}
