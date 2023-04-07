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
import {Field} from "../model/field";
import {DatePipe} from "@angular/common";

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
    this.mainzellisteHeaders = new HttpHeaders().set('mainzellisteApiVersion', '3.2')
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
      let body = new URLSearchParams();
      const convertedFields = this.convertToPatient(patient).fields
      for (const name in convertedFields) {
        body.set(name, convertedFields[name]);
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

  editPatient(displayPatient: Patient) {
    return this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: displayPatient.ids[0].idType, idString: displayPatient.ids[0].idString},
        this.mainzellisteFields
      )
    ).toPromise().then(token => {
        console.log("Edit Patient Token: " + token)
        return this.httpClient.put(this.patientList.url + "/patients/tokenId/" + token.id, this.convertToPatient(displayPatient).fields).toPromise();
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

  // Utils
  //-------

  convertToDisplayPatient(patient: Patient): Patient {
    let displayPatient = new Patient();
    for(const fieldConfig of this.patientList.fields) {
      switch (fieldConfig.type+"") {
        case "TEXT":{
          if(patient.fields[fieldConfig.mainzellisteField] != undefined) {
            displayPatient.fields[fieldConfig.name] = patient.fields[fieldConfig.mainzellisteField];
          }
          break;
        }
        case "DATE": {
          let extractDate = (fieldNames: string[], fields: { [key: string]: any }, i: number, defaultValue: string): string =>
            fieldNames.length > i && fieldNames[i] ? fields[fieldNames[i]] : defaultValue;
          let day = extractDate(fieldConfig.mainzellisteFields, patient.fields,  0, "00");
          let month = extractDate(fieldConfig.mainzellisteFields, patient.fields, 1, "00");
          let year = extractDate(fieldConfig.mainzellisteFields, patient.fields, 2, "0000");
          displayPatient.fields[fieldConfig.name] = `${year}-${month}-${day}`;
          break;
        }
      }
    }
    displayPatient.ids = patient.ids;
    return displayPatient;
  }

  convertToPatient(displayPatient: Patient): Patient {
    let patient = new Patient();
    for(const fieldConfig of this.patientList.fields) {
      switch (fieldConfig.type+"") {
        case "TEXT":{
          if(displayPatient.fields[fieldConfig.name] != undefined) {
            patient.fields[fieldConfig.mainzellisteField] = displayPatient.fields[fieldConfig.name];
          }
          break;
        }
        case "DATE": {
          if(displayPatient.fields[fieldConfig.name] != undefined ) {
            let dateStr = new DatePipe('en-US').transform(displayPatient.fields[fieldConfig.name], 'dd.MM.yyyy') || "";
            console.log(dateStr);
            const dateFields = dateStr.split('.');
            fieldConfig.mainzellisteFields.forEach((n,i) => patient.fields[n] = dateFields[i]);
          }
          break;
        }
      }
    }
    patient.ids = displayPatient.ids;
    return patient;
  }
}
