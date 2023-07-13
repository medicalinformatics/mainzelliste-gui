import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  public validateMainIdType(idTypes: string[]) {
    let config = this.data[0];
    let idType = idTypes[0];

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
