import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {AppConfigService, AssociatedIds} from "../app-config.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom, lastValueFrom, throwError} from "rxjs";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {ConsentTerminology} from "../model/consent-terminology";
import {MainzellisteField, MainzellisteFieldType} from "../model/mainzelliste-field";
import {Field, FieldType} from "../model/field";
import {IdGenerator} from "../model/idgenerator";
import {ClaimsConfig} from "../model/api/configuration-claims-data";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class BackendConfigService {
  private mainzellisteIdGenerators: IdGenerator[] = [];
  private mainzellisteAssociatedIdGenerators: IdGenerator[] = []
  private mainzellisteAssociatedIdGeneratorsMap: Map<string, IdGenerator[]> = new Map<string, IdGenerator[]>()
  private mainzellisteIdTypes: string[] = [];
  private mainzellisteFields: string[] = [];
  private mainzellisteClaims: ClaimsConfig[] = [];
  private consentTerminology!: ConsentTerminology;
  private version: string = "";

  constructor(
    private translate: TranslateService,
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) {
  }

  public init(tokenId: string | null) {
    return this.fetchMainzellisteIdGenerators(tokenId)
    .then(idGenerators => this.fetchMainzellisteAssociatedIdGenerators(tokenId))
    .then(idGenerators => this.fetchMainzellisteFields(tokenId))
    .then(fields => this.fetchClaims(tokenId))
    .then(claims => this.fetchVersion())
    .then(versions => this.readConsentTerminology());
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

  getMainzellisteClaims(): ClaimsConfig[] {
    return this.mainzellisteClaims;
  }

  getConsentTerminology() {
    return this.consentTerminology;
  }

  getVersion(): string {
    return this.version;
  }

  private fetchVersion(): Promise<{ distname: string, version: string }> {
    return lastValueFrom(this.httpClient.get<{
      distname: string,
      version: string
    }>(this.appConfigService.getMainzellisteUrl() + "/", {
      headers: new HttpHeaders()
      .set('Accept', 'application/json')
    }).pipe(
      catchError(e => {
        return throwError(() => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_get_version'), e, this.translate))
      }),
      map(info => {
        this.version = info.version
        return info;
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

  public fetchMainzellisteFields(tokenId?: string | null): Promise<MainzellisteField[]> {
    let fieldEndpointUrl = this.appConfigService.getMainzellisteUrl() + "/configuration/fields" + ( !!tokenId ? "?tokenId=" + tokenId: "" );
    return lastValueFrom(this.httpClient.get<MainzellisteField[]>(fieldEndpointUrl, {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError(e => throwError(() => new Error(this.translate.instant('error.app_config_service_fetch_fields') + fieldEndpointUrl))),
      map(mlFields => {
        //validate fields
        for (let configuredField of this.appConfigService.getFields()) {
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

  private initField(fieldName: string, configuredField: Field, backendMlField: MainzellisteField[], isDateType?: boolean) {
    // find backend field configuration
    let mlField: MainzellisteField | undefined = backendMlField.find(f => f.name == fieldName);
    if (mlField == undefined)
      throw new Error(this.translate.instant('error.app_config_service_field_not_defined_text1') + fieldName + this.translate.instant('error.app_config_service_field_not_defined_text2'))

    // set type
    if (!isDateType) {
      if (['sex', 'gender', 'geschlecht'].includes(mlField.name.toLowerCase())) {
        configuredField.type = FieldType.SEX;
      } else if (mlField.type == MainzellisteFieldType.PlainTextField)
        configuredField.type = FieldType.TEXT
      else if (mlField.type == MainzellisteFieldType.IntegerField) {
        configuredField.type = FieldType.NUMBER;
      } else
        throw new Error(this.translate.instant('error.app_config_service_type_not_supported_text1') + fieldName + this.translate.instant('error.app_config_service_type_not_supported_text2') + mlField.type + this.translate.instant('error.app_config_service_type_not_supported_text3'))
    }

    configuredField.required = mlField.required;
    if (mlField.type == MainzellisteFieldType.IntegerField)
      configuredField.validator = mlField.validation || "\\d*";
    else
      configuredField.validator = mlField.validation ?? "";
    this.mainzellisteFields.push(fieldName);
  }

  public fetchMainzellisteIdGenerators(tokenId?: string | null): Promise<IdGenerator[]> {
    return lastValueFrom(this.httpClient.get<IdGenerator[]>(
        this.appConfigService.getMainzellisteUrl() + "/configuration/idGenerators" + ( !!tokenId ? "?tokenId=" + tokenId: "" ),
        {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError((e) => throwError(() => new Error(this.translate.instant('error.app_config_service_fetch_id_generators')))),
      map(idGenerators => {
        //validate main id
        if(!tokenId)
          console.log(this.validateMainIdType(idGenerators))
        this.mainzellisteIdGenerators = idGenerators
        this.mainzellisteIdTypes = idGenerators.map(g => g.idType);
        return idGenerators;
      })
    ));
  }

  public fetchMainzellisteAssociatedIdGenerators(tokenId?: string | null): Promise<IdGenerator[]> {
    return lastValueFrom(this.httpClient.get<AssociatedIds>(
        this.appConfigService.getMainzellisteUrl() + "/configuration/idGenerators/associatedIds" + ( !!tokenId ? "?tokenId=" + tokenId: "" ),
        {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError((e) => throwError(() => new Error(this.translate.instant('error.app_config_service_fetch_id_generators')))),
      map(associatedIds => {
        this.mainzellisteAssociatedIdGenerators = [];
        for (let key in associatedIds) {
          this.mainzellisteAssociatedIdGenerators.push(...associatedIds[key])
          this.mainzellisteAssociatedIdGeneratorsMap.set(key, associatedIds[key])
        }
        return this.mainzellisteAssociatedIdGenerators;
      })
    ));
  }

  public fetchClaims(tokenId?: string | null): Promise<ClaimsConfig[]> {
    let httpParams = new HttpParams().set('filter', 'roles')
    .set('merge', true)
    .set('mergeSameTenant', true);
    if(!!tokenId){
      httpParams = httpParams.set('tokenId', tokenId);
    }
    return firstValueFrom(this.httpClient.get<ClaimsConfig[]>(this.appConfigService.getMainzellisteUrl() + "/configuration/claims", {
      headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2'),
      params: httpParams
    })
    .pipe(
      catchError((e) => throwError(() => new Error("Can't init claims configurations. Failed to connect " +
        "to the backend Endpoint /configuration/claims"))),
      map(claims => {
        this.mainzellisteClaims = claims;
        return claims;
      })
    ));
  }

  public validateMainIdType(idGenerators: IdGenerator[]) {
    if (!idGenerators.some(g => g.idType == this.appConfigService.getMainType().trim())) {
      throw new Error("mainIdType '" + this.appConfigService.getMainType() + "'not configured in the backend, please check your ui configuration");
    }
    return this.translate.instant('appConfigService.main_id_type_valid');
  }
}
