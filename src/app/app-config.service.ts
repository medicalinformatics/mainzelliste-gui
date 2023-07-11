import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OAuthConfig, PatientList} from "./model/patientlist";
import {AppConfig} from "./app-config";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

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

  private validateBackendUrl(config: PatientList) {
    return this.httpClient.get<string>(config.url.toString())
    .pipe(map(_r => 'Mainzelliste is online'),
      catchError(_e => throwError(new Error("Mainzelliste backend is offline")))
    )
  }

  public validateMainIdType() {
    let mainzellisteHeaders: HttpHeaders = new HttpHeaders().set('mainzellisteApiVersion', '3.2')
    let config = this.data[0];
    let url = config.url.toString() + "/configuration/idTypes";

    return this.httpClient.get<string[]>(url, {headers: mainzellisteHeaders})
    .pipe(
      catchError(e => throwError(new Error("Can't validate main ID Type. Failed to connect to the backend Endpoint " + url))),
      map(idTypes => idTypes[0]),
      map(idType => {
        //set main id type if the configured value is empty
        if (AppConfigService.isStringEmpty(config.mainIdType)) {
          config.mainIdType = idType;
        } else if (config.mainIdType?.trim() != idType.trim()) {
          throw new Error("The backend default id type '" + idType + "' and the configured main id type '" + config.mainIdType + "' are different")
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
