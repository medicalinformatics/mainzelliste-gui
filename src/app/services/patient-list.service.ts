import {Injectable} from '@angular/core';
import {ConfigurationService} from "./configuration.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";
import {Observable} from "rxjs";

interface Token {
  id: string
  type: string
  allowedUses: number
  remainingUses: number
  url: URL
  data: any
}

export class Id {
  constructor(
    public idType: string,
    public idString: string,
    public tentative: boolean = false,
    public uri?: URL
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class PatientListService {

  private patientList: PatientList;
  private mainzellisteHeaders: HttpHeaders
  private mainzellisteFields = ["Vorname", "Nachname", "Geburtsname", "Geburtstag", "Geburtsmonat", "Geburtsjahr", "Wohnort", "PLZ"];
  private mainzellisteResultIds = ["pid"];
  private mainzellisteMainId = "pid";

  constructor(
    private configService: ConfigurationService,
    private userService: UserService,
    private httpClient: HttpClient
  ) {
    this.patientList = this.configService.patientLists[0];
    console.log(this.patientList)
    this.mainzellisteHeaders = new HttpHeaders()
    .set('mainzellisteApiKey', this.patientList.apiKey)
    .set('mainzellisteApiVersion', '3.2')
  }

  getPatients(): Promise<Patient[]> {
    return this.httpClient.post<Token>(this.userService.user.session + "tokens", {
      "type": "readPatients",
      "data": {
        "searchIds": [
          {
            "idType": this.mainzellisteMainId,
            "idString": "*"
          }
        ],
        "resultFields": this.mainzellisteFields,
        "resultIds": this.mainzellisteResultIds
      }
    }, {
      headers: this.mainzellisteHeaders
    }).toPromise().then(token => {
      return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
    })
  }

  addPatient(patient: Patient): Promise<{ newId: string, tentative: boolean, uri: URL }> {
    return this.httpClient.post<Token>(this.userService.user.session + "tokens", {
      "type": "addPatient",
      "data": {
        "idTypes": this.mainzellisteResultIds
      }
    }, {
      headers: this.mainzellisteHeaders
    }).toPromise().then(token => {
      patient.fields.Geburtstag = patient.fields.Geburtsdatum.split('.')[0]
      patient.fields.Geburtsmonat = patient.fields.Geburtsdatum.split('.')[1]
      patient.fields.Geburtsjahr = patient.fields.Geburtsdatum.split('.')[2]
      delete patient.fields.Geburtsdatum
      let body = new URLSearchParams();
      for (let field in patient.fields) {
        body.set(field, patient.fields[field]);
      }
      return this.httpClient.post<{ newId: string, tentative: boolean, uri: URL }>(this.patientList.url + "/patients?tokenId=" + token.id, body, {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
      }).toPromise();
    })
  }

  readPatient(id: Id): Promise<Patient[]> {
    return this.httpClient.post<Token>(this.userService.user.session + "tokens", {
      "type": "readPatients",
      "data": {
        "searchIds": [
          {
            "idType": id.idType,
            "idString": id.idString
          }
        ],
        "resultFields": this.mainzellisteFields,
        "resultIds": this.mainzellisteResultIds
      }
    }, {
      headers: this.mainzellisteHeaders
    }).toPromise().then(token => {
      return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
    })
  }

  editPatient(patient: Patient) {
    return this.httpClient.post<Token>(this.userService.user.session + "tokens", {
      "type": "editPatient",
      "data": {
        "patientId": {
          "idType": "pid",
          "idString": patient.ids[0].idString
        },
        "fields":["Vorname", "Nachname", "Geburtsname", "Geburtstag", "Geburtsmonat", "Geburtsjahr", "PLZ", "Wohnort"]
      }
    }, {
      headers: this.mainzellisteHeaders
    }).toPromise().then(token => {
      console.log("Edit Patient Token: " + token)
      patient.fields.Geburtstag = patient.fields.Geburtsdatum.split('.')[0]
      patient.fields.Geburtsmonat = patient.fields.Geburtsdatum.split('.')[1]
      patient.fields.Geburtsjahr = patient.fields.Geburtsdatum.split('.')[2]
      delete patient.fields.Geburtsdatum
      return this.httpClient.put(this.patientList.url + "/patients/tokenId/" + token.id, patient.fields).toPromise();
    })
  }

  deletePatient(patient: Patient) {
    return this.httpClient.post<Token>(this.userService.user.session + "tokens", {
      "type": "deletePatient",
      "data": {
        "patientId": {
          "idType": "pid",
          "idString": patient.ids[0].idString
        }
      }
    }, {
      headers: this.mainzellisteHeaders
    }).toPromise().then(token => {
      console.log("Delete Patient Token: " + token)
      return this.httpClient.delete(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
    })
  }
}
