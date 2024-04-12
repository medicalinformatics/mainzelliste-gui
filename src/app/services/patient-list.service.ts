import {Inject, Injectable} from '@angular/core';
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
import _moment from 'moment';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {getErrorMessageFrom} from "../error/error-utils";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {Id} from "../model/id";
import {CreateIdsTokenData} from '../model/create-ids-token-data';
import {AuthorizationService} from "./authorization.service";
import {TranslateService} from '@ngx-translate/core';
import {Operation} from "../model/tenant";

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
  private addPatientErrorMessages: ErrorMessage[] = [
    ErrorMessages.CREATE_PATIENT_MISSING_FIELD,
    ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS,
    ErrorMessages.CREATE_PATIENT_CONFLICT_IDAT,
    ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH,
    ErrorMessages.CREATE_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH,
    ErrorMessages.CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH,
    ErrorMessages.CREATE_PATIENT_INVALID_FIELD,
    ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID,
    ErrorMessages.CREATE_PATIENT_INVALID_DATE_1,
    ErrorMessages.CREATE_PATIENT_INVALID_DATE_2
  ];

  private editPatientErrorMessages: ErrorMessage[] = [
    ErrorMessages.EDIT_PATIENT_EMPTY_FIELD,
    ErrorMessages.CREATE_PATIENT_MISSING_FIELD,
    ErrorMessages.EDIT_PATIENT_CONFLICT_EXT_IDS,
    ErrorMessages.EDIT_PATIENT_CONFLICT_IDAT,
    ErrorMessages.EDIT_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH,
    ErrorMessages.EDIT_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH,
    ErrorMessages.EDIT_PATIENT_CONFLICT_POSSIBLE_MATCH,
    ErrorMessages.CREATE_PATIENT_INVALID_FIELD,
    ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID,
    ErrorMessages.EDIT_PATIENT_NOT_FOUND,
    ErrorMessages.EDIT_PATIENT_CONFLICT_MATCH,
    ErrorMessages.CREATE_PATIENT_INVALID_DATE_1,
    ErrorMessages.CREATE_PATIENT_INVALID_DATE_2
  ];

  private deletePatientErrorMessages: ErrorMessage[] = [
    ErrorMessages.DELETE_PATIENT_NOT_FOUND
  ];

  private createIdsErrorMessages: ErrorMessage[] = [
    ErrorMessages.CREATE_IDS_ERROR
  ];

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private authorizationService: AuthorizationService,
    private sessionService: SessionService,
    private httpClient: HttpClient,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this.patientList = this.configService.data[0];
    this.mainzellisteHeaders = new HttpHeaders().set('mainzellisteApiVersion', '3.2')
    _moment.locale(this._locale);
  }

  getConfiguredFields(operation: Operation): Array<Field> {
    let allowedFieldNames = this.authorizationService.getAllowedFieldNames(operation);
    return this.patientList.fields.filter( f => allowedFieldNames.some( n => n == f.mainzellisteField)
      || f.mainzellisteFields != null && f.mainzellisteFields.length > 0
      && f.mainzellisteFields.every( c => allowedFieldNames.some( n => n == c)));
  }

  getIdTypes(operation?: Operation): Array<string> {
    let allowedIdTypes = operation != undefined ? this.authorizationService.getAllAllowedIdTypes(operation) : [];
    return allowedIdTypes.length == 0  ? this.configService.getMainzellisteIdTypes() : allowedIdTypes;
  }

  getFieldNames(operation: Operation): Array<string> {
    return this.authorizationService.getAllowedFieldNames(operation);
  }

  getIdGenerators(isExternal?: boolean, operation?: Operation): Array<IdGenerator> {
    let isExternalIdType = isExternal!=null && isExternal;
    let allowedIdTypes = operation != undefined ? this.authorizationService.getAllowedIdTypes(operation, isExternalIdType) : [];
    return this.configService.getMainzellisteIdGenerators()
      .filter(g => g.isExternal == isExternalIdType && (operation == undefined || allowedIdTypes.some(t => t == g.idType)));
  }

  isDebugModeEnabled(): boolean {
    return this.configService.isDebugModeEnabled();
  }

  isExternalId(idType: string, operation:Operation): boolean {
    return this.getIdGenerators(true, operation).some(g => g.idType == idType);
  }

  /**
   * @deprecated replace with getIdTypes
   */
  getConfiguredIdTypes(): Observable<Array<string>> {
    //TODO remove observable
    return of(this.configService.getMainzellisteIdTypes());
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
    return this.patientList.mainIdType != undefined && configuredIdTypes.some(t => t == this.patientList.mainIdType)? this.patientList.mainIdType : configuredIdTypes[0];
  }

  /**
   * Read Patients from backend
   * @param filters contain search fields and ids
   * @param pageIndex page number
   * @param pageSize page limit
   */
  getPatients(filters: Array<{ field: string, fields: string[], searchCriteria: string, isIdType: boolean }>,
              pageIndex: number, pageSize: number): Observable<ReadPatientsResponse> {
    // find searchIds
    let searchIds: Array<{idType: string, idString: string}> = [];
    let allowedIdTypes: string[] = [];
    //let defaultIdType = this.findDefaultIdType(this.getIdTypes());
    if (filters.every(f => !f.isIdType)) {
      // get permitted idTypes
      allowedIdTypes = this.authorizationService.getAllowedIdTypes('R', false);
      if(allowedIdTypes.length > 0 && !allowedIdTypes.some( t => t == "*"))
        searchIds = allowedIdTypes.map(type => ({idType: type, idString: "*"}));
      else
        searchIds = [{idType: "*", idString: "*"}];
    } else {
      filters.filter(f => f.isIdType).forEach(f =>
        searchIds.push({idType: f.field, idString: f.searchCriteria.trim()}));
    }

    // find current tenant id
    let tenantId = this.authorizationService.getCurrentTenant();
    if(tenantId === undefined || tenantId == "default")
      tenantId = "";

    // create read patients token
    return this.sessionService.createToken("readPatients",
      new ReadPatientsTokenData(searchIds, this.getFieldNames("R"), this.getIdTypes("R")))
    .pipe(
      // resolve read patients token
      mergeMap(token => this.httpClient.get<Patient[]>(this.patientList.url + "/patients?"
        +"tokenId=" + token.id
        + (tenantId.length == 0 ? "":"&tenantId="+tenantId)
        + "&page=" + pageIndex + "&limit=" + pageSize + "&"
        + this.convertFiltersToUrl(filters), {observe: 'response'})
      .pipe(
        map((response: HttpResponse<Patient[]>): ReadPatientsResponse => ({
            patients: response.body ?? [],
            totalCount: response.headers.get("X-Total-Count") ?? ""
          })
        )
      )),
      catchError( (error) => {
        if(error.status >= 400 && error.status < 500) {
          return of({
            patients: [],
            totalCount: "0"
          });
        } else {
          return throwError(new Error(this.translate.instant('error.patient_list_service_get_patients') + `${getErrorMessageFrom(error, this.translate)}`));
        }
      })
    )
  }

  convertFiltersToUrl(filters: Array<{ field: string, fields: string[], searchCriteria: string, isIdType: boolean }>) : string{
    return filters.filter(o => !o.isIdType)
    .map(o => {
      if(o.field == "birthday" && o.fields != undefined) {
        let moment = _moment(o.searchCriteria.trim(), _moment().localeData().longDateFormat('L'));
        if (moment.isValid()) {
          let dateArray: number[] = [moment.date(), moment.month() + 1, moment.year()];
          return o.fields.map((f,i) =>  f + "=" + dateArray[i]).join("&");
        }else
          return "";
      }else {
        return o.field + "=" + o.searchCriteria.trim()
      }
    }).join("&")
  }

  generateId(idType: string, idString: string, newIdType: string) {
    return this.sessionService.createToken("createIds", new CreateIdsTokenData([{idType, idString}], [newIdType]))
      .pipe(mergeMap(
        token => this.resolveCreateIdsToken(token.id, newIdType)
        ),
      catchError(e => {
        // handle failed token creation
        if (e instanceof HttpErrorResponse && (e.status == 404) && ErrorMessages.ML_SESSION_NOT_FOUND.match(e))
          return throwError(new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND));
        else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
          return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_create_create_ids_token'), e, this.translate));
        return throwError(e);
      }));
  }

  resolveCreateIdsToken(tokenId: string | undefined, newIdType: string): Observable<any> {
    return this.httpClient.post<Id[]>(this.patientList.url + "/ids/" + newIdType + "?tokenId=" + tokenId, {}, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2')
    })
    .pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 400 || e.status == 409)) {
          // TODO: Complete Error Handling
          let errorMessage = ErrorMessages.CREATE_IDS_ERROR;
          return throwError(new MainzellisteError(errorMessage));
        }
        return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_create_ids_token'), e, this.translate))
      })
      )
  }

  getNewIdType(patient: Patient): string[] {
    let temp: string[] = [];
    let bool: boolean;
    for (let allId of this.getIdGenerators(false, "C")) {
      bool = true;
      for (let id of patient.ids) {
        if (allId.idType == id.idType) {
          bool = false;
        }
      }
      if (bool) {
        temp.push(allId.idType);
      }
    }
    return temp;
  }

  addPatient(patient: Patient, idTypes: string[], sureness: boolean): Observable<Id> {
    return this.sessionService.createToken(
      "addPatient", new AddPatientTokenData(idTypes)
    )
    .pipe(
      mergeMap(token => this.resolveAddPatientToken(token.id, patient, sureness)),
      catchError(e => {
        // handle failed token creation
        if (e instanceof HttpErrorResponse && (e.status == 404) && ErrorMessages.ML_SESSION_NOT_FOUND.match(e))
          return throwError(new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND))
        else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
          return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_create_add_patient_token'), e, this.translate))
        return throwError(e)
      })
    );
  }

  resolveAddPatientToken(tokenId: string | undefined, patient: Patient, sureness: boolean): Observable<Id> {
    //prepare request body
    let body = new URLSearchParams();
    const convertedFields = this.convertToPatientFields(patient.fields, this.configService.getMainzellisteFields())
    for (const name in convertedFields) {
      body.set(name, convertedFields[name]);
    }
    //add external Ids
    for(let extId of patient.ids)
      body.set(extId.idType, extId.idString)

    // set sureness flag
    if(sureness)
      body.set("sureness", "true")

    //send request
    return this.httpClient.post<Id[]>(this.patientList.url + "/patients?tokenId=" + tokenId, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('mainzellisteApiVersion', '3.2')
    })
    .pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 400 || e.status == 409)) {
          let errorMessage = this.addPatientErrorMessages.find(msg => msg.match(e))
          if (errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_FIELD) {
            let fieldName: string = errorMessage.findVariables(e)[0];
            let field = this.patientList.fields.find(f => f.mainzellisteField == fieldName);
            return throwError(new MainzellisteError(errorMessage, field?.name));
          } else if( errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID) {
            return throwError(new MainzellisteError(errorMessage, errorMessage.findVariables(e)[1]));
          } if(errorMessage != undefined)
            return throwError(new MainzellisteError(errorMessage));
        }
        return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      }),
      map( ids => ids[0])
    )
  }

  async readPatient(id: Id, operation: Operation): Promise<Patient[]> {
    let readToken = await this.sessionService.createToken(
      "readPatients",
      new ReadPatientsTokenData(
        [{idType: id.idType, idString: id.idString}],
        this.getFieldNames(operation),
        this.getIdTypes(operation)
      )).toPromise();
    return this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + readToken.id).toPromise();
  }

  editPatient(id:Id, patient: Patient, sureness: boolean) {
    return this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: id.idType, idString: id.idString},
        this.getFieldNames("U"),
        this.getIdGenerators(true,"U").map( g => g.idType)
      )
    )
    .pipe(
      mergeMap(token => this.resolveEditPatientToken(token.id, patient, sureness))
    ).toPromise();
  }

  resolveEditPatientToken(tokenId: string | undefined, patient: Patient, sureness: boolean): Observable<any> {
    let fields: { [key: string]: string } =  this.convertToPatientFields(patient.fields, this.getFieldNames("U"));

    // add external ids
    patient.ids.filter(id => this.isExternalId(id.idType, "U"))
    .forEach(id => fields[id.idType] = id.idString);

    // set sureness flag
    if(sureness)
      fields['sureness'] = "true";

    return this.httpClient.put(this.patientList.url + "/patients/tokenId/" + tokenId, fields, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2')
    })
    .pipe(
      catchError(e => {
        let errorMessage;
        if (e instanceof HttpErrorResponse && (e.status == 400 || e.status == 409)) {
          errorMessage = this.editPatientErrorMessages.find(msg => msg.match(e))
          // find error message arguments
          if (errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_FIELD || errorMessage == ErrorMessages.EDIT_PATIENT_EMPTY_FIELD) {
            let fieldName: string = errorMessage.findVariables(e)[0];
            let field = this.patientList.fields.find(f => f.mainzellisteField == fieldName);
            return throwError(new MainzellisteError(errorMessage, field?.name));
          } else if( errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID) {
            return throwError(new MainzellisteError(errorMessage, errorMessage.findVariables(e)[1]));
          }
        }
        return throwError(errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
      })
    );
  }

  deletePatient(patient: Patient) {
    return this.sessionService.createToken(
      "deletePatient",
      new DeletePatientTokenData(
        {idType: patient.ids[0].idType, idString: patient.ids[0].idString}
      )
    )
    .pipe(
      mergeMap(token => this.resolveDeletePatientToken(token.id))
    ).toPromise();
  }

  resolveDeletePatientToken(tokenId: string | undefined): Observable<any> {

    return this.httpClient.delete(this.patientList.url + "/patients?tokenId=" + tokenId, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('mainzellisteApiVersion', '3.2')
    })
      .pipe(
        catchError(e => {
          let errorMessage;
          if (e instanceof HttpErrorResponse && (e.status == 404)) {
            errorMessage = this.deletePatientErrorMessages.find(msg => msg.match(e))
            // find error message arguments
            if( errorMessage == ErrorMessages.DELETE_PATIENT_NOT_FOUND) {
              return throwError(new MainzellisteError(errorMessage));
            }
          }
          return throwError(errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
        })
      );
  }

  // Utils
  //-------

  convertToDisplayPatient(patient: Patient, convertToLocal?:boolean): Patient {
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
          let date = `${year}-${month}-${day}`;
          displayPatient.fields[fieldConfig.name] = convertToLocal ? _moment(date, "YYYY-MM-DD").format('L') : date;
          break;
        }
      }
    }
    return displayPatient;
  }

  private convertToPatientFields(fields: { [p: string]: string }, permittedFieldNames: Array<string>): { [p: string]: string } {
    let result: { [p: string]: string } = {};
    for(const fieldConfig of this.patientList.fields) {
      switch (fieldConfig.type+"") {
        case "TEXT":{
          if(fields[fieldConfig.name] != undefined && permittedFieldNames.some( p => p == fieldConfig.mainzellisteField)) {
            result[fieldConfig.mainzellisteField] = fields[fieldConfig.name];
          }
          break;
        }
        case "DATE": {
          if(fields[fieldConfig.name] != undefined && fieldConfig.mainzellisteFields.every( c =>
            permittedFieldNames.some( p => p == c))) {
            let dateStr = new DatePipe('en-US').transform(fields[fieldConfig.name], 'dd.MM.yyyy') || "";
            const dateFields = dateStr.split('.');
            fieldConfig.mainzellisteFields.forEach((n,i) => result[n] = dateFields[i]);
          }
          break;
        }
      }
    }
    return result;
  }
}
