import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OAuthConfig, PatientList} from "./model/patientlist";
import {AppConfig} from "./app-config";

@Injectable({providedIn: 'root'})
export class AppConfigService {

  data: PatientList[] = [];

  constructor(private http: HttpClient) {
  }

  load(defaults?: PatientList[]): Promise<PatientList[]> {
    return new Promise<PatientList[]>(resolve => {
      this.http.get<AppConfig>('assets/config/config.json').subscribe(
        response => {
          console.log('using server-side configuration');
          this.data = Object.assign([], response.patientLists || []);
          resolve(this.data);
        },
        () => {
          console.log('using default configuration');
          this.data = Object.assign([], defaults || []);
          resolve(this.data);
        }
      );
    });
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
