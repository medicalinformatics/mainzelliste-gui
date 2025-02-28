import {Inject, Injectable} from '@angular/core';
import {SessionService} from "./session.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {PatientList} from "../model/patientlist";
import {Patient} from "../model/patient";
import {AppConfigService} from "../app-config.service";
import {ReadPatientsTokenData} from "../model/read-patients-token-data";
import {AddPatientTokenData} from "../model/add-patient-token-data";
import {EditPatientTokenData} from "../model/edit-patient-token-data";
import {DeletePatientTokenData} from "../model/delete-patient-token-data";
import {Field} from "../model/field";
import {DatePipe} from "@angular/common";
import {catchError, filter, map, mergeMap, repeat, retry, take, takeWhile} from "rxjs/operators";
import {firstValueFrom, lastValueFrom, Observable, of, throwError} from "rxjs";
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
import {Operation, Tenant} from "../model/tenant";
import {IdType} from "../model/id-type";
import {IdGenerator} from "../model/idgenerator";
import {AddPatientsSingleResponse} from "../model/add-patients-single-response";
import {TaskResponse} from "../model/task-response";
import {AddPatientRequest} from "../model/add-patient-request";
import {FilterItem} from "../model/filter-item";

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

  private addPatientsErrorMessages: ErrorMessage[] = [
    ErrorMessages.CREATE_PATIENTS_UNAUTHORIZED
  ]


  private fetchPatientsJobErrorMessages: ErrorMessage[] = [
    ErrorMessages.FETCH_PATIENTS_JOB_NOTFOUND,
    ErrorMessages.FETCH_PATIENTS_JOB_UNAUTHORIZED
  ]

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
    if(operation != undefined)
       return this.authorizationService.getAllAllowedUniqueIdTypes(operation);
    else
      return this.configService.getMainzellisteIdTypes();
  }

  getAllIdTypes(operation: Operation): Array<string>{
    return [ ...this.getIdTypes(operation),
      ...this.getAssociatedIdTypes(false, operation),
      ...this.getAssociatedIdTypes(true, operation)];
  }

  getAllExternalIdTypes(operation?: Operation): Array<string> {
    return [ ...this.getUniqueIdTypes(true, operation),
      ...this.getAssociatedIdTypes(true, operation)];
  }

  getAllInternalIdTypes(operation: Operation): Array<string> {
    return [ ...this.getUniqueIdTypes(false, operation),
      ...this.getAssociatedIdTypes(false, operation)];
  }

  getUniqueIdTypes(isExternal: boolean, operation?: Operation): Array<string> {
    if(operation != undefined && !this.authorizationService.isCurrentTenantPermissionsEmpty())
       return this.authorizationService.getAllowedUniqueIdTypes(operation, isExternal);
    else
      return this.configService.getMainzellisteIdGenerators()
    .filter(g => g.isExternal == isExternal).map(g => g.idType);
  }

  getAssociatedIdTypes(isExternal: boolean, operation?: Operation, nodeName?:string): Array<string> {
    let idGenerators : IdGenerator[] = nodeName !== undefined ? this.configService.getMainzellisteAssociatedIdGeneratorsMap().get(nodeName) ?? []: []
    if(operation != undefined && !this.authorizationService.isCurrentTenantPermissionsEmpty())
      return this.authorizationService.getAllowedAssociatedIdTypes(operation, isExternal)
      .filter( t => idGenerators.length == 0 || idGenerators.some( g => g.idType == t));
    else
      return (nodeName !== undefined ? idGenerators : this.configService.getMainzellisteAssociatedIdGenerators())
    .filter(g => g.isExternal == isExternal).map(g => g.idType);
  }

  getRelatedAssociatedIdsMapFrom(idTypes: IdType[], patientIds: Id[], areExternal: boolean, operation: Operation): Map<string, Id[]> {
    let result = new Map<string, Id[]>()
    for (let idType of idTypes) {
      let relatedIdTypes = this.authorizationService.getRelatedAssociatedIdTypes(idType.name, areExternal, operation);
      result.set(idType.name, !idType.isExternal && idType.isAssociated ?
        patientIds.filter(id => relatedIdTypes.includes(id.idType)) : [])
    }
    return result
  }

  findRelatedIds(id: Id, ids: Id[]): Observable<Id[]> {
    let uniqueIdTypes = this.getIdTypes("R");
    if (uniqueIdTypes?.includes(id.idType))
      return of(ids.filter(e => uniqueIdTypes.includes(e.idType)));
    else
      return this.fetchRelatedAssociatedIds(id);
  }

  fetchRelatedAssociatedIds(id: Id): Observable<Id[]> {
    return this.readPatient(id, "R", [], this.getAllRelatedAssociatedIdTypes(id.idType, "R"))
    .pipe(
      mergeMap(patients => patients.map(p => p.ids))
    )
  }

  getAllRelatedAssociatedIdTypes(idType: string, operation: Operation) {
    return [...this.authorizationService.getRelatedAssociatedIdTypes(idType, true, operation),
      ...this.authorizationService.getRelatedAssociatedIdTypes(idType, false, operation)]
  }

  getRelatedAssociatedIdTypes(idType: string, areExternal: boolean, operation: Operation): string[] {
    return this.authorizationService.getRelatedAssociatedIdTypes(idType, areExternal, operation);
  }

  getFieldNames(operation: Operation): Array<string> {
    return this.authorizationService.getAllowedFieldNames(operation);
  }

  getIdGenerators(isExternal?: boolean, operation?: Operation): Array<IdGenerator> {
    let isExternalIdType = isExternal!=null && isExternal;
    let allowedIdTypes = operation != undefined ? this.authorizationService.getAllowedUniqueIdTypes(operation, isExternalIdType) : [];
    return this.configService.getMainzellisteIdGenerators()
      .filter(g => g.isExternal == isExternalIdType && (operation == undefined || allowedIdTypes.some(t => t == g.idType)));
  }

  isDebugModeEnabled(): boolean {
    return this.configService.isDebugModeEnabled();
  }

  isUniqueExternalIdType(idType: string, operation:Operation): boolean {
    return this.getIdGenerators(true, operation).some(g => g.idType == idType);
  }

  isExternalIdType(idType: string, operation?:Operation): boolean {
    return this.getAllExternalIdTypes(operation).some( t => t == idType);
  }

  /**
   * @deprecated replace with getIdTypes
   */
  getConfiguredIdTypes(): Observable<Array<string>> {
    //TODO remove observable
    return of(this.configService.getMainzellisteIdTypes());
  }

  findDefaultIdType(configuredIdTypes: string[]): string {
    if (Tenant.DEFAULT_ID == this.authorizationService.currentTenantId &&
        this.patientList.mainIdType != undefined &&
        configuredIdTypes.some(t => t == this.patientList.mainIdType)
    )
      return this.patientList.mainIdType;
    else
      return configuredIdTypes[0];
  }

  /**
   * Read Patients from backend
   * @param filters contain search fields and ids
   * @param pageIndex page number
   * @param pageSize page limit
   */
  getPatients(filters: Array<FilterItem>, pageIndex: number, pageSize: number, ignoreOrder:boolean): Observable<ReadPatientsResponse> {
    // find current tenant id
    let tenantId = this.authorizationService.currentTenantId;
    if(tenantId === undefined || tenantId == Tenant.DEFAULT_ID)
      tenantId = "";

    // find searchIds
    let searchIds: Array<{idType: string, idString: string}> = [];
    let allowedIdTypes: string[] = [];
    //let defaultIdType = this.findDefaultIdType(this.getIdTypes());
    if (filters.every(f => !f.isIdType)) {
      // get permitted idTypes
      allowedIdTypes = tenantId.length > 0 ? this.authorizationService.getTenantIdTypes() : this.authorizationService.getAllowedUniqueIdTypes('R', false);
      if(allowedIdTypes.length > 0 && !allowedIdTypes.some( t => t == "*"))
        searchIds = allowedIdTypes.map(type => ({idType: type, idString: "*"}));
      else
        searchIds = [{idType: "*", idString: "*"}];
    } else {
      filters.filter(f => f.isIdType).forEach(f => {
        if(typeof(f.searchCriteria) === 'string')
          searchIds.push({idType: f.field, idString: f.searchCriteria.trim()});
        else
          (f.searchCriteria as string[]).forEach( v => searchIds.push({idType: f.field, idString: v.trim()}))
      });
    }

    let resultIdTypes = new Set(this.getIdTypes("R"));
    //Note: find tenant id types to determine to which domain they belong
    if(this.configService.showDomainsInIDCard())
      this.authorizationService.getAllTenantIdTypes().forEach( t => resultIdTypes.add(t));

    // create read patients token
    return this.sessionService.createToken("readPatients",
      new ReadPatientsTokenData(searchIds, this.getFieldNames("R"), [... resultIdTypes]))
    .pipe(
      // resolve read patients token
      mergeMap(token => this.httpClient.get<Patient[]>(this.patientList.url + "/patients?"
        +"tokenId=" + token.id
        + (tenantId.length == 0 ? "":"&tenantId="+tenantId)
          + "&ignoreOrder=" + ignoreOrder
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
        if(error.status < 400 && error.status >= 500)
          console.log("Failed to fetch patients. Cause: " + `${getErrorMessageFrom(error, this.translate)}`);
        return of({
          patients: [],
          totalCount: "0"
        });
      })
    )
  }

  convertFiltersToUrl(filters: Array<FilterItem>) : string{
    return filters.filter(o => !o.isIdType && typeof(o.searchCriteria) === 'string')
    .map(o => {
      if(o.field == "birthday" && o.fields != undefined) {
        let moment = _moment((o.searchCriteria as string).trim(), _moment().localeData().longDateFormat('L'));
        if (moment.isValid()) {
          let dateArray: number[] = [moment.date(), moment.month() + 1, moment.year()];
          return o.fields.map((f,i) =>  f + "=" + dateArray[i]).join("&");
        } else
          return "";
      } else {
        return o.field + "=" + (o.searchCriteria as string).trim()
      }
    }).join("&")
  }

  generateId(idType: string, idString: string, newIdType: string) {
    return this.generateIdArray(idType, [idString], newIdType);
  }

  generateIdArray(idType: string, idString: string[], newIdType: string): Observable<[{idType: string, idString: string}]> {
    if(idString.length == 0) {
      throw new Error("idString cant be empty");
    }

    let ids: {idType: string; idString: string}[] = [];
    for(const element of idString) {
      ids.push({idType: idType, idString: element})
    }

    return this.sessionService.createToken("createIds", new CreateIdsTokenData(ids, [newIdType]))
      .pipe(mergeMap(
        token => this.resolveCreateIdsToken(token.id, newIdType)
        ),
      catchError(e => {
        // handle failed token creation
        if (e instanceof HttpErrorResponse && (e.status == 404) && ErrorMessages.ML_SESSION_NOT_FOUND.match(e))
          return throwError( () => new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND));
        else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
          return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_create_create_ids_token'), e, this.translate));
        return throwError( () => e);
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
          return throwError( () => new MainzellisteError(errorMessage));
        }
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_create_ids_token'), e, this.translate))
      })
      )
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
          return throwError( () => new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND))
        else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
          return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_create_add_patient_token'), e, this.translate))
        return throwError( () => e)
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
      body.append(extId.idType, extId.idString)

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
          const errorMessage = this.addPatientErrorMessages.find(msg => msg.match(e))
          if (errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_FIELD) {
            let fieldName: string = errorMessage.findVariables(e)[0];
            let field = this.patientList.fields.find(f => f.mainzellisteField == fieldName);
            return throwError( () => new MainzellisteError(errorMessage, field?.name));
          } else if( errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID) {
            return throwError( () => new MainzellisteError(errorMessage, errorMessage.findVariables(e)[1]));
          } else {
            return throwError( () => errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
          }
        }
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      }),
      map( ids => ids[0])
    )
  }

  addPatients(patients: AddPatientRequest[], idTypes: string[], sureness: boolean): Observable<AddPatientsSingleResponse[]> {
    return this.runAddPatients(patients, idTypes, sureness)
    .pipe(
      mergeMap( e => this.httpClient.get<TaskResponse[]>(e.locationUrl, {observe: 'response'})
      .pipe(
        repeat({count: Infinity, delay: 1000}),
        filter((response: HttpResponse<TaskResponse[]>): boolean => ( response.status == 202)),
        take(1),
        map(r => r.body?.map(this.convertTaskResponse) ?? [])
      )),
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 401 || e.status == 404)) {
          const errorMessage = this.fetchPatientsJobErrorMessages.find(msg => msg.match(e))
          if (errorMessage != undefined) {
            return throwError( () => new MainzellisteError(errorMessage));
          }
        }
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.fetch_patients_job_not_found'), e, this.translate))
      }),
    )
  }

  convertTaskResponse(taskResponse: TaskResponse): AddPatientsSingleResponse {
    return taskResponse.status == 201 ? {ids: taskResponse.body as Id[]} :
      {ids: [], error: `status[${taskResponse.status}]:${(taskResponse.body as { message: string }).message}`}
  }

  runAddPatients(patients: AddPatientRequest[], idTypes: string[], sureness: boolean): Observable<{ tokenId:string, locationUrl: string}> {
    return this.sessionService.createToken(
      "addPatients", new AddPatientTokenData(idTypes)
    )
    .pipe(
      mergeMap(token => this.resolveAddPatientsToken(token.id, patients, sureness)),
      catchError(e => {
        // handle failed token creation
        if (e instanceof HttpErrorResponse && (e.status == 404) && ErrorMessages.ML_SESSION_NOT_FOUND.match(e))
          return throwError( () => new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND))
        else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
          return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.create_patients_token_failed'), e, this.translate))
        return throwError( () => e)
      })
    );
  }

  resolveAddPatientsToken(tokenId: string | undefined, patients: AddPatientRequest[], sureness: boolean): Observable<{ tokenId:string, locationUrl: string}> {
    //set sureness flag
    patients.forEach(p => p.sureness = sureness);

    //send request
    return this.httpClient.post<string>(this.patientList.url + "/jobs?tokenId=" + tokenId, patients, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2'),
      observe: 'response'
    })
    .pipe(
      map(response => {
        return {
          tokenId: tokenId ?? "",
          locationUrl: this.patientList.url + "/jobs" + response.headers.get("Location")?.split("/jobs")[1] ?? ""
        }
      }),
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 401) && ErrorMessages.CREATE_PATIENTS_UNAUTHORIZED.match(e))
          return throwError(() => new MainzellisteError(ErrorMessages.CREATE_PATIENTS_UNAUTHORIZED))
        return throwError(() => new MainzellisteUnknownError("Failed to run balk pseudonymization", e, this.translate))
      })
    );
  }

  readPatient(id: Id, operation: Operation, resultFields?: string[], resultIdTypes?: string[]): Observable<Patient[]> {
    return this.sessionService.createToken(
        "readPatients",
        new ReadPatientsTokenData(
            [{idType: id.idType, idString: id.idString}],
            resultFields ?? this.getFieldNames(operation),
            resultIdTypes ?? this.getAllIdTypes(operation)
        )).pipe(
        mergeMap(readToken =>
            this.httpClient.get<Patient[]>(this.patientList.url + "/patients?tokenId=" + readToken.id))
    );
  }

  editPatient(id:Id, patient: Patient, sureness: boolean) {
    return firstValueFrom(this.sessionService.createToken(
      "editPatient",
      new EditPatientTokenData(
        {idType: id.idType, idString: id.idString},
        this.getFieldNames("U"),
        this.getIdGenerators(true,"U").map( g => g.idType)
      )
    )
    .pipe(
      mergeMap(token => this.resolveEditPatientToken(token.id, patient, sureness))
    ));
  }

  resolveEditPatientToken(tokenId: string | undefined, patient: Patient, sureness: boolean): Observable<any> {
    let fields: { [key: string]: string } =  this.convertToPatientFields(patient.fields, this.getFieldNames("U"));

    // add external ids
    patient.ids.filter(id => this.isUniqueExternalIdType(id.idType, "U"))
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
        if (e instanceof HttpErrorResponse && (e.status == 400 || e.status == 409)) {
          const errorMessage = this.editPatientErrorMessages.find(msg => msg.match(e))
          // find error message arguments
          if (errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_FIELD || errorMessage == ErrorMessages.EDIT_PATIENT_EMPTY_FIELD) {
            let fieldName: string = errorMessage.findVariables(e)[0];
            let field = this.patientList.fields.find(f => f.mainzellisteField == fieldName);
            return throwError( () => new MainzellisteError(errorMessage, field?.name));
          } else if( errorMessage == ErrorMessages.CREATE_PATIENT_INVALID_EXT_ID) {
            return throwError( () => new MainzellisteError(errorMessage, errorMessage.findVariables(e)[1]));
          } else {
            return throwError( () => errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
          }
        } else {
          return throwError( () => e);
        }
      })
    );
  }

  deletePatient(patient: Patient) {
    return lastValueFrom(this.sessionService.createToken(
      "deletePatient",
      new DeletePatientTokenData(
        {idType: patient.ids[0].idType, idString: patient.ids[0].idString}
      )
    )
    .pipe(
      mergeMap(token => this.resolveDeletePatientToken(token.id))
    ));
  }

  resolveDeletePatientToken(tokenId: string | undefined): Observable<any> {

    return this.httpClient.delete(this.patientList.url + "/patients?tokenId=" + tokenId, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('mainzellisteApiVersion', '3.2')
    })
      .pipe(
        catchError(e => {
          if (e instanceof HttpErrorResponse && (e.status == 404)) {
            const errorMessage = this.deletePatientErrorMessages.find(msg => msg.match(e))
            // find error message arguments
            if( errorMessage == ErrorMessages.DELETE_PATIENT_NOT_FOUND) {
              return throwError( () => new MainzellisteError(errorMessage));
            } else {
              return throwError( () => errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
            }
          }
          return throwError( () => e);
        })
      );
  }

  // Utils
  //-------

  convertToDisplayPatient(patient: Patient, convertDateToLocal?:boolean, convertDisplaySex?:boolean,
                          tenants?: { id: string, name: string, idTypes: string[] }[]): Patient {
    let displayPatient = new Patient();
    //ids
    displayPatient.ids = patient.ids;

    // tenants
    if((tenants?.length || 0) > 1)
      displayPatient.tenants = tenants?.filter(t =>
        t.id != Tenant.DEFAULT_ID
        && t.idTypes.some( t => displayPatient.ids.some( id => id.idType == t)))
      .map(t => t.name);

    // fields
    if(patient.fields == undefined){
      return displayPatient;
    }
    for(const fieldConfig of this.patientList.fields) {
      switch (fieldConfig.type+"") {
        case "SEX": {
          if(patient.fields[fieldConfig.mainzellisteField] != undefined) {
            if(!convertDisplaySex){
              displayPatient.fields[fieldConfig.name] = patient.fields[fieldConfig.mainzellisteField];
            } else {
              const i18nAttribute = this.configService.data[0].genderFieldValues.find(g => g.value == patient.fields[fieldConfig.mainzellisteField])?.i18n;
              if(i18nAttribute != undefined && i18nAttribute.length > 0)
                displayPatient.fields[fieldConfig.name] = this.translate.instant(i18nAttribute);
            }
          }
          break;
        }
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
          displayPatient.fields[fieldConfig.name] = convertDateToLocal ? _moment(date, "YYYY-MM-DD").format('L') : date;
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
        case "SEX":
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
