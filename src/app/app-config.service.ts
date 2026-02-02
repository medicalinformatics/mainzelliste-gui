import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FooterLogo, OAuthConfig, PatientList} from "./model/patientlist";
import {AppConfig} from "./app-config";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {Field} from "./model/field";
import {TranslateService} from '@ngx-translate/core';
import {IdGenerator} from "./model/idgenerator";

export interface AssociatedIds {
  [key: string] : [IdGenerator]
}

@Injectable({providedIn: 'root'})
export class AppConfigService {

  data: PatientList[] = [];
  private layoutFooterLogos: FooterLogo[] = [];
  private copyConcatenatedIdEnabled: boolean = false;
  private copyIdEnabled: boolean = false;
  private configurationEnabled: boolean = false;
  private _showDomainsInIDCard: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService
  ) {
  }

  /**
   * read and validate the configuration file
   */
  init(): Promise<PatientList[]> {
    //TODO cache backend configurations
    return new Promise<PatientList[]>((resolve, reject) => {
      this.httpClient.get<AppConfig>('assets/config/config.json')
      .pipe(
        map(r => Object.assign([], r.patientLists || []))
      )
      .subscribe({
        next: r => {
          // set configuration
          this.data = r;

          // init feature toggle
          this.copyConcatenatedIdEnabled = this.data[0].betaFeatures?.copyConcatenatedId ?? false;
          this.copyIdEnabled = this.data[0].betaFeatures?.copyId ?? false;
          this.configurationEnabled = this.data[0].betaFeatures?.configuration ?? false;
          this._showDomainsInIDCard = this.data[0].betaFeatures?.showDomainsInIDCard ?? false;

          if(!this.data[0].genderFieldValues || this.data[0].genderFieldValues.length == 0)
            this.data[0].genderFieldValues = PatientList.defaultFenderFieldValues

          // init layout
          this.layoutFooterLogos = this.data[0].layout?.footerLogos ?? [];

          //start validation
          this.validateBackendUrl(this.data[0])
          .subscribe({
            next: message => console.log(message),
            error: e => reject(e),
            complete: () => resolve(this.data)
          })
        },
        error: _e => reject(new Error(this.translate.instant('error.app_config_service_config_not_found')))
      });
    });
  }

  isCopyConcatenatedIdEnabled(): boolean {
    return this.copyConcatenatedIdEnabled;
  }

  isCopyIdEnabled(): boolean {
    return this.copyIdEnabled;
  }

  isConfigurationEnabled(): boolean {
    return this.configurationEnabled;
  }

  public showDomainsInIDCard(): boolean {
    return this._showDomainsInIDCard;
  }

  getFields(): Field[] {
    return this.data[0].fields || []
  }

  getMainzellisteUrl(): string {
    return this.data[0].url.toString();
  }

  getMainType(): string {
    return this.data[0].mainIdType || "";
  }

  isDebugModeEnabled(): boolean {
    return this.data[0].debug != undefined && this.data[0].debug;
  }

  getDefaultLanguage(){
    return this.data[0].defaultLanguage || "en-US";
  }

  public getLayoutFooterLogos(): FooterLogo[] {
    return this.layoutFooterLogos;
  }

  private validateBackendUrl(config: PatientList) {
    // if the url contains a path and no slash at the end, the backend responses with a 302 redirect, which is not possible in XHR request
    let urlSuffix  = new URL(config.url.toString()).pathname.endsWith('/') ?"":"/";
    return this.httpClient.get<string>(config.url.toString() + urlSuffix)
    .pipe(map(_r => this.translate.instant('appConfigService.backend_online')),
      catchError(_e => throwError( () => new Error(this.translate.instant('error.app_config_service_backend_offline'))))
    )
  }

  private static validateOAuthConfig(config: OAuthConfig | undefined): boolean {
    return config !== undefined && !AppConfigService.isStringEmpty(config.url)
      && !AppConfigService.isStringEmpty(config.realm)
      && !AppConfigService.isStringEmpty(config.clientId)
  }

  private static isStringEmpty(value: string | undefined): boolean {
    return value === undefined || value.trim().length === 0;
  }
}
