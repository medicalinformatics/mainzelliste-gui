import {Injectable} from '@angular/core';
import {ConsentChoiceItem, ConsentDisplayItem, ConsentItem, ConsentModel} from "./consentModel";
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import Client from 'fhir-kit-client'
import {Bundle} from "fhir/r4";
import {ConsentTemplate} from "./consent-dialog/consent-dialog.component";
import {SessionService} from "./services/session.service";
import {DatePipe} from "@angular/common";
import {AppConfigService} from "./app-config.service";

@Injectable({
  providedIn: 'root'
})

export class ConsentService {
  private consentsUrl = 'api/consents';  // URL to web api
  private client: Client;
  private readonly mainzellisteBaseUrl: string;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient,
              private sessionService: SessionService,
              private appConfigService: AppConfigService) {
    this.mainzellisteBaseUrl = this.appConfigService.data[0].url.toString();
    this.client = new Client({baseUrl: this.mainzellisteBaseUrl + "/fhir"});
  }

  /**
   * save ui change in consent fhir resource
   * @param consent
   */
  setConsentFhirResource(consent: ConsentModel) {
    if (consent.fhirResource) {
      //set fhir consent date
      let datePipe: DatePipe = new DatePipe('en-US');
      consent.fhirResource.dateTime = datePipe.transform(consent.date, 'yyyy-MM-dd')!;

      //set fhir consent provisions from ui data model
      consent.items.filter(i => i instanceof ConsentChoiceItem)
      .map(i => i as ConsentChoiceItem).forEach(i => {
        if (!consent.fhirResource?.provision) {
          this.handleError<fhir4.QuestionnaireResponse>('contained fhir consent template contain no provisions')
        } else if (consent.fhirResource.provision.provision) {
          // find provision with the given linkedId
          let provision = consent.fhirResource.provision.provision.find(p => {
            return p.extension?.find(ext => ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
              ext.valueString == i.linkId)
          });
          // set provision type : denied or permit
          if (provision) {
            provision.type = i.answer;
          }
        }
      })
    }
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) to ui data model
   * @param questionnaire fhir Questionnaire resource
   */
  convertTemplateToConsentModel(questionnaire: fhir4.Questionnaire | undefined): ConsentModel {
    if (questionnaire == undefined) {
      this.handleError<any>("questionnaire not found");
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    let items: ConsentItem[] = [];
    questionnaire.item?.forEach(item => {
      if (item.type == 'display') {
        let displayItem: ConsentDisplayItem = new ConsentDisplayItem(item.linkId, item.text || "")
        items.push(displayItem);
      } else if (item.type == 'choice') {
        let choiceItem: ConsentChoiceItem = new ConsentChoiceItem(item.linkId, item.text || "")
        items.push(choiceItem);
      } else {
        this.handleError<any>(`questionnaire item type [${item.type}] not support yet`);
      }
    })

    let consentTitle = questionnaire?.title || "";

    let fhirConsent: fhir4.Consent | undefined = undefined;
    if (questionnaire.contained == undefined || questionnaire.contained.length > 1
      || questionnaire.contained.length == 0) {
      this.handleError<any>("contained consent resource not found");
    } else {
      fhirConsent = questionnaire.contained[0] as fhir4.Consent;
    }
    return {
      id: questionnaire.id,
      title: consentTitle,
      date: new Date(),
      items: items,
      fhirResource: fhirConsent,
      template: questionnaire
    };
  }


  async addConsent(consent: ConsentModel) {

    if (consent.fhirResource == undefined) {
      this.handleError<any>("fhir consent resource not found");
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    // set patient id
    consent.fhirResource.patient = {
      identifier: {
        system: this.mainzellisteBaseUrl + "/id/" + consent.patientId?.idType,
        value: consent.patientId?.idString
      }
    }

    // create token
    let token = await this.sessionService.createToken(
      "addConsent", {}
    ).toPromise();
    console.log("addConsent token created: " + token)

    return this.client.create({
      resourceType: 'Consent', body: consent.fhirResource,
      headers: {'Authorization': 'MainzellisteToken ' + token.id}
    })
    .then(resource => resource as fhir4.Consent)
    .catch(error => {
      if (error instanceof TypeError) {
        let typeError: TypeError = error;
        console.log("Persist Consent error name: " + typeError.name);
        console.log("Persist Consent error msg: " + typeError.message);
        console.log("Persist Consent error stack: " + typeError.stack);
      }
      console.log(error);
      return undefined;
    });
  }

  /**
   * return a map of content templates
   */
  getConsentTemplates(): Promise<Map<string, ConsentTemplate>> {
    let result = new Map();
    return this.client.search({resourceType: 'Questionnaire'})
    .then(resource => {
      let bundle: Bundle<fhir4.Questionnaire> = resource as Bundle<fhir4.Questionnaire>
      console.log("#consent template found: " + bundle.entry?.length);
      return bundle.entry?.forEach(r => result.set(r.resource?.id, {
        title: r.resource?.title,
        fhirQuestionnaire: r.resource
      })) || result;
    })
    .catch(error => {
      if (error instanceof TypeError) {
        let typeError: TypeError = error;
        console.log("error name: " + typeError.name);
        console.log("error msg: " + typeError.message);
        console.log("error stack: " + typeError.stack);
      }
      console.log(error);
      return result;
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //////////////////////////////
  ////    DRAFT
  //////////////////////////////

  // getConsent(id: number): Promise<ConsentModel|undefined> {
  //   return this.client.read({resourceType: 'QuestionnaireResponse', id: id.toString()})
  //   .then( resource => {
  //     let questionnaireResponse: fhir4.QuestionnaireResponse = resource as fhir4.QuestionnaireResponse
  //     return this.convertQuestionnaireResponseToDetailedConsent(questionnaireResponse).then();
  //   })
  //   .catch( error => {
  //     if (error instanceof TypeError) {
  //       let typeError: TypeError = error;
  //       console.log("error name: " + typeError.name);
  //       console.log("error msg: " + typeError.message);
  //       console.log("error stack: " + typeError.stack);
  //     }
  //     console.log(error);
  //     return undefined;
  //   });
  //   // const url = `${this.consentsUrl}/${id}`;
  //   // return this.http.get<Consent>(url).pipe(
  //   //   tap(_ => this.log(`fetched consent id=${id}`)),
  //   //   catchError(this.handleError<Consent>(`getConsent id=${id}`))
  //   // );
  // }


  // async getConsents(): Promise<ConsentModel[]> {
  //   let consentTemplates: Map<string,string> = await this.getConsentTemplates();
  //   return this.client.search({resourceType: 'QuestionnaireResponse'})
  //   .then( resource => {
  //     let bundle: Bundle<fhir4.QuestionnaireResponse> = resource as Bundle<fhir4.QuestionnaireResponse>
  //     console.log("#consent found: " + bundle.entry?.length);
  //     return bundle.entry?.map(r => this.convertQuestionnaireResponseToConsent(r.resource, consentTemplates)) || [];
  //   })
  //   .catch( error => {
  //     if (error instanceof TypeError) {
  //       let typeError: TypeError = error;
  //       console.log("error name: " + typeError.name);
  //       console.log("error msg: " + typeError.message);
  //       console.log("error stack: " + typeError.stack);
  //     }
  //     console.log(error);
  //     return [];
  //   });
  //   // return this.http.get<Consent[]>(this.consentsUrl)
  //   //   .pipe(
  //   //     tap(_ => this.log('fetched consents')),
  //   //     catchError(this.handleError<Consent[]>('getConsents', []))
  //   //   );
  // }

  private log(message: string) {
    // this.messageService.add(`ConsentService: ${message}`);
  }

  updateConsent(consent: ConsentModel) {
    return this.http.put(this.consentsUrl, consent, this.httpOptions).pipe(
      tap(_ => this.log(`updated consent id=${consent.id}`)),
      catchError(this.handleError<any>('updateConsent'))
    );
  }

  deleteConsent(id: number): Observable<ConsentModel> {
    const url = `${this.consentsUrl}/${id}`;

    return this.http.delete<ConsentModel>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted consent id=${id}`)),
      catchError(this.handleError<ConsentModel>('deleteConsent'))
    );
  }

  /* GET consents whose name contains search term */
  searchConsents(term: string): Observable<ConsentModel[]> {
    if (!term.trim()) {
      // if not search term, return empty consent array.
      return of([]);
    }
    return this.http.get<ConsentModel[]>(`${this.consentsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found consents matching "${term}"`) :
        this.log(`no consents matching "${term}"`)),
      catchError(this.handleError<ConsentModel[]>('searchConsents', []))
    );
  }
}
