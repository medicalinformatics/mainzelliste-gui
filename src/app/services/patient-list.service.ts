import {Injectable} from '@angular/core';
import {SessionService} from "./session.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";
import {AppConfigService} from "../app-config.service";
import {ReadPatientsTokenData} from "../model/read-patients-token-data";
import {AddPatientTokenData} from "../model/add-patient-token-data";
import {EditPatientTokenData} from "../model/edit-patient-token-data";
import {DeletePatientTokenData} from "../model/delete-patient-token-data";

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
  // Projektnamen kommen hier rein "mainzellisteResultIds"- davor stand "pid" im Array

  private mainzellisteResultIds = ["pid"]; //Objekt mit allen Ids eines Patienten
  private mainzellisteMainId = "eagerPid";
  private mainzellisteIds: string[] = [];

  constructor(
    private configService: AppConfigService,
    private sessionService: SessionService,
    private httpClient: HttpClient
  ) {
    this.patientList = this.configService.data[0];
    this.mainzellisteHeaders = new HttpHeaders()
      .set('mainzellisteApiKey', this.patientList.apiKey)
      .set('mainzellisteApiVersion', '3.2')
    // this.mainzellisteIds=this.patientList.

    httpClient.get<string[]>(
      this.patientList.url+"/configuration/idTypes",
      {headers: this.mainzellisteHeaders }
    ).toPromise().then((response) => {
      this.mainzellisteIds = response
      if(this.patientList.mainIdType != undefined){
        this.mainzellisteMainId = this.patientList.mainIdType;
      }else{
        this.mainzellisteMainId = this.mainzellisteIds[0];
      }
      console.log(this.mainzellisteIds);
      console.log(this.mainzellisteMainId);
    });

    //TODO funktion in der results befüllt wird und nicht vordefiniert ist wie oben (Aufgabe idTypen herausbekommen)

    // this.patientList.fieldMappings["FIRST_NAME"];
    //TODO In mainzellisteResultIds müssen alle Sammel Ids alle Patienten gepusht werden

   // this.patientService.mainzellisteResultIds.push() = PatientList.;


  }

  getPatients(): Promise<Patient[]>{
    return this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData([{
          idType: this.mainzellisteMainId,
          idString: "*"
        }], this.mainzellisteFields,
        this.mainzellisteResultIds)
    ).toPromise().then(token => {
      return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
      // soll hier auch die Zuweisung der patientenID in die URL erfolgen?
    })
  }

  addPatient(patient: Patient): Promise<{ newId: string, tentative: boolean, uri: URL }> {
    return this.sessionService.createToken(
      "addPatient",
      new AddPatientTokenData(
        this.mainzellisteResultIds
      )
    ).toPromise().then(token => {
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
    console.log(id);
    return this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData(
        [{idType: id.idType, idString: id.idString}],
        this.mainzellisteFields,
        this.mainzellisteResultIds
      )
    ).toPromise().then(token => {
      return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
    })
  }

  editPatient(patient: Patient) {
    return this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: "pid", idString: patient.ids[0].idString}
      )
    ).toPromise().then(token => {
        console.log("Edit Patient Token: " + token)
        patient.fields.Geburtstag = patient.fields.Geburtsdatum.split('.')[0]
        patient.fields.Geburtsmonat = patient.fields.Geburtsdatum.split('.')[1]
        patient.fields.Geburtsjahr = patient.fields.Geburtsdatum.split('.')[2]
        delete patient.fields.Geburtsdatum
        return this.httpClient.put(this.patientList.url + "/patients/tokenId/" + token.id, patient.fields).toPromise();
    })
  }

  deletePatient(patient: Patient) {
    return this.sessionService.createToken(
      "deletePatient",
      new DeletePatientTokenData(
        {idType: "pid", idString: patient.ids[0].idString}
      )
    ).toPromise().then(token => {
        console.log("Delete Patient Token: " + token)
        return this.httpClient.delete(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
    })
  }
}
