import {Injectable} from '@angular/core';
import {ConfigurationService} from "./configuration.service";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";

interface Token {
  id: string
  type: string
  allowedUses: number
  remainingUses: number
  url: URL
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class PatientListService {

  private patientList: PatientList;
  private mainzellisteHeaders: { mainzellisteApiVersion: string; mainzellisteApiKey: string };
  private mainzellisteFields = ["Vorname", "Nachname", "Geburtsname", "Geburtstag", "Geburtsmonat", "Geburtsjahr", "Wohnort", "PLZ"];
  private mainzellisteResultIds = ["pid"];
  private mainzellisteMainId = "pid";

  constructor(
    private configService: ConfigurationService,
    private userService: UserService,
    private httpClient: HttpClient
  ) {
    this.patientList = this.configService.patientLists[0];
    this.mainzellisteHeaders = {
      mainzellisteApiKey: this.patientList.apiKey,
      mainzellisteApiVersion: "3.2"
    }
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
}
