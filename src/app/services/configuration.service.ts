import {Injectable} from '@angular/core';
import {PatientList} from "../model/patientlist";
import {HttpClient} from "@angular/common/http";

interface AppConfig {
  patientLists: PatientList[]
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  patientLists: PatientList[] = [];
  selectedPatientList!: PatientList;

  constructor(httpClient: HttpClient) {
    httpClient.get<AppConfig>('/assets/config/config.json')
    .toPromise()
    .then(config => {
      this.patientLists = config.patientLists;
      this.selectedPatientList = this.patientLists[0];
    });
  }
}
