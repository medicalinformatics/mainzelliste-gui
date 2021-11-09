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

  constructor(
    private httpClient: HttpClient
  ) {
  }

  loadConfig() {
    this.httpClient.get<AppConfig>('/assets/config/config.json')
    .toPromise()
    .then(config => {
      console.log(config)
      this.patientLists = config.patientLists;
      this.selectedPatientList = this.patientLists[0];
    });
  }
}
