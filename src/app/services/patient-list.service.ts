import {Injectable} from '@angular/core';
import {SessionService} from "./session.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";
import {AppConfigService, IdGenerator} from "../app-config.service";
import {ReadPatientsTokenData} from "../model/read-patients-token-data";
import {AddPatientTokenData} from "../model/add-patient-token-data";
import {EditPatientTokenData} from "../model/edit-patient-token-data";
import {DeletePatientTokenData} from "../model/delete-patient-token-data";
import {Field} from "../model/field";
import {DatePipe} from "@angular/common";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable, of, throwError} from "rxjs";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessage, ErrorMessages} from "../error/error-messages";

export class Id {
  constructor(
    public idType: string,
    public idString: string,
    public tentative: boolean = false,
    public uri?: URL
  ) {}
}

export interface ReadPatientsResponse {
  patients: Patient[];
  totalCount: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientListService {

  private patientList: PatientList;
  private mainzellisteHeaders: HttpHeaders
  private addPatientConflictErrorMessages: ErrorMessage[] = [ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS,
    ErrorMessages.CREATE_PATIENT_CONFLICT_IDAT, ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH,
    ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH, ErrorMessages.CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH];

  constructor(
    private configService: AppConfigService,
    private sessionService: SessionService,
    private httpClient: HttpClient
  ) {
    this.patientList = this.configService.data[0];
    this.mainzellisteHeaders = new HttpHeaders().set('mainzellisteApiVersion', '3.2')
  }

  getConfiguredFields(): Array<Field> {
    return this.patientList.fields;
  }

  getIdTypes(): Array<string> {
    return this.configService.getMainzellisteIdTypes();
  }

  getIdGenerators(): Array<IdGenerator> {
    return this.configService.getMainzellisteIdGenerators();
  }

  /**
   * @deprecated replace with getIdTypes
   */
  getConfiguredIdTypes(): Observable<Array<string>> {
    //TODO remove observable
    console.log("getConfiguredIdTypes " + this.configService.getMainzellisteIdTypes())
    return of(this.configService.getMainzellisteIdTypes());
  }

  getMainIdType(): string {
    return this.patientList.mainIdType == undefined ? this.getIdTypes()[0] : this.patientList.mainIdType;
  }

  /**
   * @deprecated replace with getMainIdType
   */
  getConfiguredDefaultIdType(): Observable<string> {
    if(this.patientList.mainIdType != undefined){
      return of(this.patientList.mainIdType);
    }else{ //TODO should be called one time and cached
      return this.getConfiguredIdTypes().pipe(map(idTypes => idTypes[0]));
    }
  }

  findDefaultIdType(configuredIdTypes: string[]): string {
    return this.patientList.mainIdType != undefined ? this.patientList.mainIdType : configuredIdTypes[0];
  }

  //TODO Refactor: replace with getConfiguredIdTypes
  getPatientListIdTypes(): Promise<Array<string>> {
    return this.getConfiguredIdTypes().toPromise();
  }

  //TODO Refactor: replace with getConfiguredDefaultIdType
  async getPatientListMainIdType(): Promise<string> {
    return this.getConfiguredDefaultIdType().toPromise();
  }

  /**
   * Read Patients from backend
   * @param filters contain search fields and ids
   * @param pageIndex page number
   * @param pageSize page limit
   */
  getPatients(filters: Array<{ field: string, searchCriteria: string, isIdType: boolean }>,
              pageIndex: number, pageSize: number): Observable<ReadPatientsResponse> {
    // find searchIds
    let searchIds: Array<Id> = [];
    let defaultIdType = this.findDefaultIdType(this.getIdTypes());
    if (filters.every(f => !f.isIdType)) {
      searchIds = [{idType: defaultIdType, idString: "*", tentative: false}];
    } else {
      filters.filter(f => f.isIdType).forEach(f =>
        searchIds.push({idType: f.field, idString: f.searchCriteria.trim(), tentative: false}));
    }
    // create read patients token
    return this.sessionService.createToken("readPatients",
      new ReadPatientsTokenData(searchIds, this.configService.getMainzellisteFields(), this.getIdTypes()))
    .pipe(
      // resolve read patients token
      mergeMap(token => this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + token.id
        + "&page=" + pageIndex + "&limit=" + pageSize + "&"
        + filters.filter(o => !o.isIdType)
        .map(o => o.field + "=" + o.searchCriteria.trim()).join("&"), {observe: 'response'})
      .pipe(
        map((response: HttpResponse<Patient[]>): ReadPatientsResponse => ({
            patients: response.body ?? [],
            totalCount: response.headers.get("X-Total-Count") ?? ""
          })
        )
      )),
      catchError( (error) => {
        if(error.status >= 400 && error.status < 500) {
          if (error.status != 404)
            console.log(error);
          return of({
            patients: [],
            totalCount: "0"
          });
        } else
          return throwError(() => new Error(`Service unavailable: cause status ` +
            `[${error.status}] msg: ${error.message}`));
      })
    )
  }

  addPatient(patient: Patient, idTypes: string[]): Promise<Id> {
    return this.sessionService.createToken(
      "addPatient", new AddPatientTokenData(idTypes)
    )
    .pipe(
      mergeMap(token => this.resolveAddPatientToken(token.id, patient))
    ).toPromise();
  }

  resolveAddPatientToken(tokenId: string | undefined, patient: Patient): Observable<Id> {
    //prepare request body
    let body = new URLSearchParams();
    const convertedFields = this.convertToPatient(patient).fields
    for (const name in convertedFields) {
      body.set(name, convertedFields[name]);
    }
    //add external Ids
    for(let extId of patient.ids)
      body.set(extId.idType, extId.idString)

    //send request
    return this.httpClient.post<Id[]>(this.patientList.url + "/patients?tokenId=" + tokenId, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('mainzellisteApiVersion', '3.2')
    })
    .pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse) {
          if (e.status == 400 && e.error == ErrorMessages.CREATE_PATIENT_MISSING_FIELD.message) {
            return throwError(new MainzellisteError(ErrorMessages.CREATE_PATIENT_MISSING_FIELD));
          } else if(e.status == 409){
            let errorMessage = this.addPatientConflictErrorMessages.find( msg => msg.message == e.error )
            if(errorMessage != undefined)
              return throwError(new MainzellisteError(errorMessage));
            else {
              errorMessage = this.addPatientConflictErrorMessages.find( msg => msg.message == e.error.message )
              if(errorMessage != undefined)
                return throwError(new MainzellisteError(errorMessage));
            }
          }
        }
        return throwError(e);
      }),
      map( ids => ids[0])
    )
  }

  async readPatient(id: Id): Promise<Patient[]> {
    console.log(id);
    let readToken = await this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData(
        [{idType: id.idType, idString: id.idString}],
        this.configService.getMainzellisteFields(),
        await this.getPatientListIdTypes()
      )).toPromise();
    return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + readToken.id).toPromise();
  }

  editPatient(displayPatient: Patient) {
    return this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: displayPatient.ids[0].idType, idString: displayPatient.ids[0].idString},
        this.configService.getMainzellisteFields()
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
    displayPatient.ids = patient.ids;
    if(patient.fields == undefined){
      return displayPatient;
    }
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
