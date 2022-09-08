import {Injectable} from '@angular/core';
import {SessionService} from "./session.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";
import {AppConfigService} from "../app-config.service";
import {ReadPatientsTokenData} from "../model/read-patients-token-data";
import {AddPatientTokenData} from "../model/add-patient-token-data";
import {EditPatientTokenData} from "../model/edit-patient-token-data";
import {DeletePatientTokenData} from "../model/delete-patient-token-data";
import {Field} from "../model/field";

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
  private mainzellisteFields: string[] = [];

  constructor(
    private configService: AppConfigService,
    private sessionService: SessionService,
    private httpClient: HttpClient
  ) {
    this.patientList = this.configService.data[0];

    // init mainzelliste field array from configuration
    let fields: Array<Field> = this.patientList.fields;
    let index: number = 0;
    for(const i in fields){
      if(fields[i].mainzellisteFields != undefined){
        for(const j in fields[i].mainzellisteFields) {
          this.mainzellisteFields[index] = fields[i].mainzellisteFields[j];
          index++;
        }
      } else {
        this.mainzellisteFields[index] = fields[i].mainzellisteField;
        index++;
      }
    }
    this.mainzellisteHeaders = new HttpHeaders()
      .set('mainzellisteApiKey', this.patientList.apiKey)
      .set('mainzellisteApiVersion', '3.2')
  }

  getPatientListFields(): Promise<Array<Field>>{
    return new Promise((resolve, reject) => {
      resolve(this.patientList.fields);
    });
  }

  getPatientListIdTypes(): Promise<Array<string>>{
    return this.httpClient.get<string[]>(
      this.patientList.url+"/configuration/idTypes",
      {headers: this.mainzellisteHeaders }
    ).toPromise();
  }

   async getPatientListMainIdType():Promise<string>{
     let patientListIdTypes = await this.getPatientListIdTypes();
     if(this.patientList.mainIdType != undefined){
       return this.patientList.mainIdType;
     }else{
       return patientListIdTypes[0];
     }
   }

  async getPatients(): Promise<Patient[]>{
    console.log(await this.getPatientListMainIdType());
    let token = await this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData([{
          idType: await this.getPatientListMainIdType(),
          idString: "*"
        }], this.mainzellisteFields,
        await this.getPatientListIdTypes())
    ).toPromise();
    return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
  }

  async addPatient(patient: Patient, idType?: string): Promise<{ newId: string, tentative: boolean, uri: URL }> {
    console.log(await this.getPatientListIdTypes())
    if(idType == undefined){
      idType = await this.getPatientListMainIdType();
    }
    return this.sessionService.createToken(
      "addPatient",
      new AddPatientTokenData(
        [idType]
      )
    ).toPromise().then(token => {
      patient.fields.Geburtstag = patient.fields.Geburtsdatum.split('.')[0]
      patient.fields.Geburtsmonat = patient.fields.Geburtsdatum.split('.')[1]
      patient.fields.Geburtsjahr = patient.fields.Geburtsdatum.split('.')[2]
      console.log("Vers." +patient.fields.Versicherungsnummer);
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

  async readPatient(id: Id): Promise<Patient[]> {
    console.log(id);
    let readToken = await this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData(
        [{idType: id.idType, idString: id.idString}],
        this.mainzellisteFields,
        await this.getPatientListIdTypes()
      )).toPromise();
    return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + readToken.id).toPromise();
  }

  editPatient(patient: Patient) {
    return this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: patient.ids[0].idType, idString: patient.ids[0].idString}
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

  async deletePatient(patient: Patient): Promise<Object> {
    let token = await this.sessionService.createToken(
      "deletePatient",
      new DeletePatientTokenData(
        {idType: "pid", idString: patient.ids[0].idString}
      )
    ).toPromise();
      return this.httpClient.delete(this.patientList.url + "/patients?tokenId=" + token.id).toPromise();
  }
}
