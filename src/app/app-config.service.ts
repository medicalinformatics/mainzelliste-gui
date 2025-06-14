import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FooterLogo, OAuthConfig, PatientList} from "./model/patientlist";
import {AppConfig} from "./app-config";
import {catchError, map} from "rxjs/operators";
import {firstValueFrom, lastValueFrom, throwError} from "rxjs";
import {MainzellisteField, MainzellisteFieldType} from "./model/mainzelliste-field";
import {Field, FieldType} from "./model/field";
import {MainzellisteUnknownError} from './model/mainzelliste-unknown-error';
import {TranslateService} from '@ngx-translate/core';
import {ClaimsConfig} from "./model/api/configuration-claims-data";
import {IdGenerator} from "./model/idgenerator";
import {ConsentTerminology} from "./model/consent-terminology";

export interface AssociatedIds {
  [key: string] : [IdGenerator]
}

@Injectable({providedIn: 'root'})
export class AppConfigService {

  data: PatientList[] = [];
  private mainzellisteIdGenerators: IdGenerator[] = [];
  private mainzellisteAssociatedIdGenerators: IdGenerator[] = []
  private mainzellisteAssociatedIdGeneratorsMap: Map<string, IdGenerator[]> = new Map<string, IdGenerator[]>()
  private mainzellisteIdTypes: string[] = [];
  private mainzellisteFields: string[] = [];
  private mainzellisteClaims: ClaimsConfig[] = [];
  private version: string = "";
  private layoutFooterLogos: FooterLogo[] = [];
  private copyConcatenatedIdEnabled: boolean = false;
  private copyIdEnabled: boolean = false;
  private configurationEnabled: boolean = false;
  private _showDomainsInIDCard: boolean = false;
  private consentTerminology!: ConsentTerminology;

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

  getMainzellisteIdTypes(): string[] {
    return this.mainzellisteIdTypes;
  }

  getMainzellisteIdGenerators(): IdGenerator[] {
    return this.mainzellisteIdGenerators;
  }

  getMainzellisteAssociatedIdGenerators(): IdGenerator[] {
    return this.mainzellisteAssociatedIdGenerators;
  }

  getMainzellisteAssociatedIdGeneratorsMap(): Map<string, IdGenerator[]> {
    return this.mainzellisteAssociatedIdGeneratorsMap;
  }

  getMainzellisteFields(): string[] {
    return this.mainzellisteFields;
  }

  getFields(): Field[] {
    return this.data[0].fields || []
  }

  getMainzellisteClaims(): ClaimsConfig[] {
    return this.mainzellisteClaims;
  }

  getMainzellisteUrl(): string {
    return this.data[0].url.toString();
  }

  isDebugModeEnabled(): boolean {
    return this.data[0].debug != undefined && this.data[0].debug;
  }

  getVersion(): string {
    return this.version;
  }

  public getLayoutFooterLogos(): FooterLogo[] {
    return this.layoutFooterLogos;
  }

  getConsentTerminology(){
    return this.consentTerminology;
  }

  public fetchVersion(): Promise<{distname: string, version: string}> {
    return lastValueFrom(this.httpClient.get<{distname: string, version: string}>(this.data[0].url + "/", {
      headers: new HttpHeaders()
      .set('Accept', 'application/json')
    }).pipe(
      catchError(e => {
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_get_version'), e, this.translate))
      }),
      map( info => {
        this.version = info.version
        return info;
      })
    ));
  }

  private validateBackendUrl(config: PatientList) {
    // if the url contains a path and no slash at the end, the backend responses with a 302 redirect, which is not possible in XHR request
    let urlSuffix  = new URL(config.url.toString()).pathname.endsWith('/') ?"":"/";
    return this.httpClient.get<string>(config.url.toString() + urlSuffix)
    .pipe(map(_r => this.translate.instant('appConfigService.backend_online')),
      catchError(_e => throwError( () => new Error(this.translate.instant('error.app_config_service_backend_offline'))))
    )
  }

  public fetchMainzellisteIdGenerators(): Promise<IdGenerator[]> {
    return lastValueFrom(this.httpClient.get<IdGenerator[]>(this.data[0].url + "/configuration/idGenerators", {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError((e) => throwError( () => new Error(this.translate.instant('error.app_config_service_fetch_id_generators')))),
      map(idGenerators => {
        console.log(this.validateMainIdType(idGenerators))
        this.mainzellisteIdGenerators = idGenerators
        this.mainzellisteIdTypes = idGenerators.map( g => g.idType);
        return idGenerators;
      })
    ));
  }

    public fetchMainzellisteAssociatedIdGenerators(): Promise<IdGenerator[]> {
      return lastValueFrom(this.httpClient.get<AssociatedIds>(this.data[0].url + "/configuration/idGenerators/associatedIds", {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
        .pipe(
            catchError((e) => throwError( () => new Error(this.translate.instant('error.app_config_service_fetch_id_generators')))),
            map(associatedIds => {
              this.mainzellisteAssociatedIdGenerators = [];
              for(let key in associatedIds){
                this.mainzellisteAssociatedIdGenerators.push(...associatedIds[key])
                this.mainzellisteAssociatedIdGeneratorsMap.set(key, associatedIds[key])
              }
              return this.mainzellisteAssociatedIdGenerators;
            })
        ));
    }

    public fetchClaims(): Promise<ClaimsConfig[]> {
      return firstValueFrom(this.httpClient.get<ClaimsConfig[]>(this.data[0].url + "/configuration/claims", {
              headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2'),
              params: new HttpParams().set('filter', 'roles').set('merge', true)
          })
          .pipe(
              catchError((e) => throwError( () => new Error("Can't init claims configurations. Failed to connect " +
                  "to the backend Endpoint /configuration/claims"))),
              map(claims => {
                  this.mainzellisteClaims = claims;
                  return claims;
              })
          ));
    }

  readConsentTerminology() {
    return firstValueFrom(
      this.httpClient.get<ConsentTerminology>('assets/consent/mii-broad-consent-versions.json')
      .pipe(
        catchError((e) => throwError(() => new Error("Can't init consent " +
          "terminology. Failed to find file 'assets/consent/mii-broad-consent-versions.json'"))),
        map(terminology => {
          this.consentTerminology = terminology;
          return terminology;
        })
      )
    );
  }

  public fetchMainzellisteFields(): Promise<MainzellisteField[]> {
    let fieldEndpointUrl = this.data[0].url + "/configuration/fields";
    return lastValueFrom(this.httpClient.get<MainzellisteField[]>(fieldEndpointUrl, {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError(e => throwError( () => new Error(this.translate.instant('error.app_config_service_fetch_fields') + fieldEndpointUrl))),
      map(mlFields => {
        //validate fields
        for (let configuredField of this.data[0].fields) {
          // init date field
          if (configuredField.mainzellisteFields != undefined) {
            configuredField.type = FieldType.DATE;
            for (let currentField of configuredField.mainzellisteFields) {
              this.initField(currentField, configuredField, mlFields, true)
            }
          } else { // init other fields
            this.initField(configuredField.mainzellisteField, configuredField, mlFields);
          }
        }
        return mlFields;
      })
    ));
  }

  private initField(fieldName: string, configuredField:Field, backendMlField: MainzellisteField[], isDateType?: boolean) {
    // find backend field configuration
    let mlField: MainzellisteField|undefined = backendMlField.find(f => f.name == fieldName);
    if (mlField == undefined)
      throw new Error(this.translate.instant('error.app_config_service_field_not_defined_text1') + fieldName + this.translate.instant('error.app_config_service_field_not_defined_text2'))

    // set type
    if(!isDateType) {
      if(['sex', 'gender', 'geschlecht'].includes(mlField.name.toLowerCase())){
        configuredField.type = FieldType.SEX;
      } else if (mlField.type == MainzellisteFieldType.PlainTextField)
        configuredField.type = FieldType.TEXT
      else if (mlField.type == MainzellisteFieldType.IntegerField) {
        configuredField.type = FieldType.NUMBER;
      }
      else
        throw new Error(this.translate.instant('error.app_config_service_type_not_supported_text1') + fieldName + this.translate.instant('error.app_config_service_type_not_supported_text2') + mlField.type + this.translate.instant('error.app_config_service_type_not_supported_text3'))
    }

    configuredField.required = mlField.required;
    if (mlField.type == MainzellisteFieldType.IntegerField)
      configuredField.validator = mlField.validation || "\\d*";
    else
      configuredField.validator = mlField.validation ?? "";
    this.mainzellisteFields.push(fieldName);
  }

  public validateMainIdType(idGenerators: IdGenerator[]) {
    let config = this.data[0];

    //set main id type if the configured value is empty
    if (config.mainIdType != undefined && !idGenerators.some( g => g.idType == config.mainIdType?.trim())) {
      throw new Error("mainIdType '" + config.mainIdType + "'not configured in the backend, please check your ui configuration");
    }
    return this.translate.instant('appConfigService.main_id_type_valid');
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
