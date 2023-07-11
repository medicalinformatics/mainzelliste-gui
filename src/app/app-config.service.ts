import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OAuthConfig, PatientList} from "./model/patientlist";
import {AppConfig} from "./app-config";
import {catchError, map} from "rxjs/operators";
import {concat, throwError} from "rxjs";

@Injectable({providedIn: 'root'})
export class AppConfigService {

  data: PatientList[] = [];

  constructor(private httpClient: HttpClient) {
  }

  /**
   * read and validate the configuration file
   */
  load(): Promise<PatientList[]> {
    return new Promise<PatientList[]>((resolve, reject) => {
      this.httpClient.get<AppConfig>('assets/config/config.json')
      .pipe(map(r => Object.assign([], r.patientLists || [])))
      .subscribe(
        r => {
          // set configuration
          this.data = r;

          //start validation
          concat(
            this.validateBackendUrl(this.data[0])
            // this.validateMainIdType(this.data[0])
          )
          .subscribe(
            message => console.log(message),
            e => reject(new Error(e)),
            () => resolve(this.data)
          )
        },
        _e => reject(new Error("UI configuration file not found"))
      );
    });
  }

  private validateBackendUrl(config: PatientList) {
    return this.httpClient.get<string>(config.url.toString())
    .pipe(map(_r => 'Mainzelliste is online'),
      catchError(_e => throwError("Mainzelliste backend is offline"))
    )
  }

  private validateMainIdType(config: PatientList) {
    let mainzellisteHeaders: HttpHeaders = new HttpHeaders().set('mainzellisteApiVersion', '3.2')
    let url = config.url.toString() + "/configuration/idTypes";

    return this.httpClient.get<string[]>(url, {headers: mainzellisteHeaders})
    .pipe(
      catchError(e => throwError("Can't validate main ID Type. Failed to connect to the backend Endpoint " + url)),
      map(idTypes => idTypes[0]),
      map(idType => {
        if (!!config.mainIdType) {
          //set main id type if the configured value is empty
          config.mainIdType = idType;
        } else if (config.mainIdType?.trim() != idType.trim()) {
          throwError("The backend default id type " + idType + " and " + config.mainIdType + "the configured main id type are different")
        }
        return "Main id type is valid";
      }));
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
