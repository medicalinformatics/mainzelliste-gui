import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OAuthConfig, PatientList, ConfigRole} from "./model/patientlist";
import {AppConfig} from "./app-config";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {MainzellisteField, MainzellisteFieldType} from "./model/mainzelliste-field";
import {Field, FieldType} from "./model/field";


export interface IdGenerator {
  name: string,
  idType: string,
  isExternal: boolean,
  isPersistant: boolean
}

@Injectable({providedIn: 'root'})
export class AppConfigService {

  data: PatientList[] = [];
  private mainzellisteIdGenerators: IdGenerator[] = [];
  private mainzellisteIdTypes: string[] = [];
  private mainzellisteFields: string[] = [];

  private consentEnabled: boolean = false;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * read and validate the configuration file
   */
  init(): Promise<PatientList[]> {
    //TODO cache backend configurations
    return new Promise<PatientList[]>((resolve, reject) => {
      this.httpClient.get<AppConfig>('assets/config/config.json')
      .pipe(map(r => Object.assign([], r.patientLists || [])))
      .subscribe(
        r => {
          // set configuration
          this.data = r;

          // init feature toggle
          this.consentEnabled = this.data[0].betaFeatures?.consent ?? false;

          //start validation
          this.validateBackendUrl(this.data[0])
          .subscribe(
            message => console.log(message),
            e => reject(e),
            () => resolve(this.data)
          )
        },
        _e => reject(new Error("UI configuration file not found"))
      );
    });
  }

  isConsentEnabled(): boolean {
    return this.consentEnabled;
  }

  getMainzellisteIdTypes(): string[] {
    return this.mainzellisteIdTypes;
  }

  getMainzellisteExternalIdTypes(): string[] {
    return this.mainzellisteIdGenerators.filter( g => g.isExternal).map( g => g.idType);
  }

  getMainzellisteIdGenerators(): IdGenerator[] {
    return this.mainzellisteIdGenerators;
  }

  getMainzellisteFields(): string[] {
    return this.mainzellisteFields;
  }

  getMainzellisteUrl(): string {
    return this.data[0].url.toString();
  }

  isDebugModeEnabled(): boolean {
    return this.data[0].debug != undefined && this.data[0].debug;
  }

  getRolesWithPermissions(): ConfigRole[]{
    return this.data[0].roles
  }

  private validateBackendUrl(config: PatientList) {
    // if the url contains a path and no slash at the end, the backend responses with a 302 redirect, which is not possible in XHR request
    let urlSuffix  = new URL(config.url.toString()).pathname.endsWith('/') ?"":"/";
    return this.httpClient.get<string>(config.url.toString() + urlSuffix)
    .pipe(map(_r => 'Mainzelliste is online'),
      catchError(_e => throwError(new Error("Mainzelliste backend is offline")))
    )
  }

  public fetchMainzellisteIdGenerators(): Promise<IdGenerator[]> {
    return this.httpClient.get<IdGenerator[]>(this.data[0].url + "/configuration/idGenerators", {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError((e) => throwError(new Error("Can't init id types. Failed to connect to the backend Endpoint /configuration/idGenerators"))),
      map(idGenerators => {
        console.log(this.validateMainIdType(idGenerators))
        this.mainzellisteIdGenerators = idGenerators
        this.mainzellisteIdTypes = idGenerators.map( g => g.idType);
        return idGenerators;
      })
    ).toPromise();
  }

  public fetchMainzellisteFields(): Promise<MainzellisteField[]> {
    let fieldEndpointUrl = this.data[0].url + "/configuration/fields";
    return this.httpClient.get<MainzellisteField[]>(fieldEndpointUrl, {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      catchError(e => throwError(new Error("Can't validate field. Failed to connect to the backend Endpoint " + fieldEndpointUrl))),
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
    ).toPromise();
  }

  private initField(fieldName: string, configuredField:Field, backendMlField: MainzellisteField[], isDateType?: boolean) {
    // find backend field configuration
    let mlField: MainzellisteField|undefined = backendMlField.find(f => f.name == fieldName);
    if (mlField == undefined)
      throw new Error("Configured field '" + fieldName + "' not defined in backend configuration")

    // set type
    if(!isDateType) {
      if (mlField.type != MainzellisteFieldType.PlainTextField)
        throw new Error("Configured field '" + fieldName + "' type '" + mlField.type + "' not supported yet")
      configuredField.type = FieldType.TEXT
    }

    configuredField.required = mlField.required;
    configuredField.validator = mlField.validation ?? "";
    this.mainzellisteFields.push(fieldName);
  }

  public validateMainIdType(idGenerators: IdGenerator[]) {
    let config = this.data[0];
    let idType = idGenerators[0].idType;

    //set main id type if the configured value is empty
    if (AppConfigService.isStringEmpty(config.mainIdType)) {
      config.mainIdType = idType;
    } else if (config.mainIdType?.trim() != idType.trim()) {
      throw new Error("The backend default id type '" + idType + "' and the configured main id type '" + config.mainIdType + "' are different")
    }
    return "Main id type is valid";
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
