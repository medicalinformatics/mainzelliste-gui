import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import Client from 'fhir-kit-client'
import {SessionService} from "./services/session.service";
import {DatePipe} from "@angular/common";
import {AppConfigService} from "./app-config.service";
import {ConsentTemplate} from "./model/consent-template";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "./model/consent";

@Injectable({
  providedIn: 'root'
})

export class ConsentService {
  private readonly mainzellisteBaseUrl: string;
  private client: Client;

  constructor(private sessionService: SessionService,
              private appConfigService: AppConfigService) {
    this.mainzellisteBaseUrl = this.appConfigService.data[0].url.toString();
    this.client = new Client({baseUrl: this.mainzellisteBaseUrl + "/fhir"});
  }

  public isServiceEnabled(): boolean {
    return this.appConfigService.isConsentEnabled();
  }

  /**
   * serialize ui change in consent fhir resource
   * @param dataModel
   */
  public serializeConsentDataModelToFhir(dataModel: Consent) {
    if (dataModel.fhirResource) {
      //set fhir consent date
      let datePipe: DatePipe = new DatePipe('en-US');
      dataModel.fhirResource.dateTime = datePipe.transform(dataModel.createdAt, 'yyyy-MM-dd')!;

      //set validity period
      let period = dataModel.fhirResource?.provision?.period;
      if (period == undefined || !period.end || period.end.trim().length < 1) {
        dataModel.fhirResource.provision!.period = {
          start: datePipe.transform(dataModel.validFrom, 'yyyy-MM-dd') || undefined
        }
      } else {
        let periodAsDate = 0;
        if ((period.start && period.start.trim().length > 0))
          periodAsDate = new Date(period.end).getTime() - new Date(period.start).getTime();
        dataModel.fhirResource.provision!.period = {
          start: datePipe.transform(dataModel.validFrom, 'yyyy-MM-dd') || undefined,
          end: datePipe.transform(new Date((dataModel.validFrom?.getTime() || 0) + periodAsDate), 'yyyy-MM-dd') || undefined
        }
      }

      //set fhir consent provisions from ui data model
      dataModel.items.filter(i => i instanceof ConsentChoiceItem)
      .map(i => i as ConsentChoiceItem).forEach(i => {
        if (!dataModel.fhirResource?.provision) {
          this.handleError<fhir4.QuestionnaireResponse>('contained fhir consent template contain no provisions')
        } else if (dataModel.fhirResource.provision.provision) {
          // find provision with the given linkedId
          let provision = dataModel.fhirResource.provision.provision.find(p => {
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
   * @param template ui template data model
   */
  public getNewConsentDataModelFromTemplate(template: ConsentTemplate | undefined): Consent {
    return this.deserializeConsentDataModelFrom(template?.definition, undefined);
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) and consent fhir resource to ui data model
   * @param questionnaire fhir consent template resource
   * @param fhirConsent fhir consent resource
   */
  private deserializeConsentDataModelFrom(questionnaire: fhir4.Questionnaire | undefined, fhirConsent: fhir4.Consent | undefined): Consent {
    if (questionnaire == undefined) {
      this.handleError<any>("questionnaire not found");
      return {
        id: "",
        title: "NOT FOUND",
        createdAt: new Date(),
        validFrom: new Date(),
        period: 0,
        items: []
      };
    }

    let initNewDataModel = false;
    if (!fhirConsent) {
      if (questionnaire.contained == undefined || questionnaire.contained.length > 1
        || questionnaire.contained.length == 0) {
        this.handleError<any>("contained consent resource not found");
      } else {
        fhirConsent = questionnaire.contained[0] as fhir4.Consent;
        //init date
        fhirConsent.dateTime = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')!;
        initNewDataModel = true;
      }
    }

    // init template items: display text and questions
    let items: ConsentItem[] = [];
    questionnaire.item?.forEach(item => {
      if (item.type == 'display') {
        let displayItem: ConsentDisplayItem = new ConsentDisplayItem(item.linkId, item.text || "")
        items.push(displayItem);
      } else if (item.type == 'choice') {

        // find answer in fhir consent
        let answer: "deny" | "permit" | undefined = 'deny';
        if (fhirConsent?.provision && fhirConsent.provision.provision) {
          // find provision with the given linkedId
          let provision = fhirConsent.provision.provision.find(p => {
            return p.extension?.find(ext => ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
              ext.valueString == item.linkId)
          });
          // set provision type : denied or permit
          if (provision) {
            answer = provision.type || 'deny';
          }
        }

        let choiceItem: ConsentChoiceItem = new ConsentChoiceItem(item.linkId, item.text || "", answer)
        items.push(choiceItem);
      } else {
        this.handleError<any>(`questionnaire item type [${item.type}] not support yet`);
      }
    })

    // calculate period from consent resource
    let fhirPeriod = fhirConsent?.provision?.period;
    let period;
    let validFrom = new Date();
    if (fhirPeriod == undefined || !fhirPeriod.end || fhirPeriod.end.trim().length < 1) {
      period = 0;
    } else if ((!fhirPeriod.start || fhirPeriod.start.trim().length < 1)) {
      period = new Date(fhirPeriod.end).getTime() - validFrom.getTime();
    } else {
      validFrom = !initNewDataModel ? new Date(fhirPeriod.start) : validFrom;
      period = new Date(fhirPeriod.end).getTime() - validFrom.getTime();
    }

    return {
      id: fhirConsent?.id,
      title: questionnaire?.title || "",
      createdAt: new Date(fhirConsent?.dateTime || ""),
      validFrom: validFrom,
      period: period,
      items: items,
      fhirResource: fhirConsent,
      template: questionnaire
    };
  }

  public async addConsent(dataModel: Consent) {

    if (dataModel.fhirResource == undefined) {
      this.handleError<any>("fhir consent resource not found");
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    //find if consent exist
    let consents = await this.getConsents(dataModel.patientId?.idType!, dataModel.patientId?.idString!);
    let existingConsent = consents.find( c => c.templateName == dataModel.template?.name);
    if(existingConsent && existingConsent.fhirResource){
      // id consent exist update
      dataModel.fhirResource = existingConsent.fhirResource;
      return this.editConsent(dataModel);
    } else {
      // set patient id
      dataModel.fhirResource.patient = {
        identifier: {
          system: this.mainzellisteBaseUrl + "/id/" + dataModel.patientId?.idType,
          value: dataModel.patientId?.idString
        }
      }
    }

    this.serializeConsentDataModelToFhir(dataModel);

    // create token
    let token = await this.sessionService.createToken(
      "addConsent", {}
    ).toPromise();

    return this.client.create({
      resourceType: 'Consent', body: dataModel.fhirResource,
      headers: {'Authorization': 'MainzellisteToken ' + token.id}
    })
    .then(resource => resource as fhir4.Consent)
    .catch(error => this.handleException(error, undefined));
  }

  public async editConsent(dataModel: Consent) {

    if (dataModel.fhirResource == undefined) {
      this.handleError<any>("fhir consent resource not found");
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    this.serializeConsentDataModelToFhir(dataModel);

    // create token
    let token = await this.sessionService.createToken(
      "editConsent", {}
    ).toPromise();

    return this.client.update({
      resourceType: 'Consent', id: dataModel.fhirResource.id, body: dataModel.fhirResource,
      headers: {'Authorization': 'MainzellisteToken ' + token.id}
    })
    .then(resource => resource as fhir4.Consent)
    .catch(error => this.handleException(error, undefined));
  }

  public async readConsent(id: string): Promise<Consent> {
    if (id == undefined) {
      this.handleError<any>("fhir consent resource not found");
      return {
        id: "",
        title: "NOT FOUND",
        createdAt: new Date(),
        validFrom: new Date(),
        period: 0,
        items: []
      };
    }

    let consentTemplates: Map<string, fhir4.Questionnaire> = await this.getConsentTemplatesResources();

    // create token
    let token = await this.sessionService.createToken(
      "readConsent", {}
    ).toPromise();

    let consentDataModel: Consent;
    return this.client.read({
      resourceType: 'Consent', id: id,
      headers: {'Authorization': 'MainzellisteToken ' + token.id}
    })
    .then(resource => {
      // find template
      let consent: fhir4.Consent = resource as fhir4.Consent;
      let templateIds = this.findConsentTemplateId(resource?.policy || []);
      let template = [...consentTemplates].find(([k, v]) => templateIds.find(tId => tId == k)) || [];
      // init consent data model
      consentDataModel = this.deserializeConsentDataModelFrom(template[1], consent);
      return consentDataModel;
    })
    .catch(error => this.handleException(error, consentDataModel));
  }

  public async getConsents(idType: string, idString: string): Promise<Consent[]> {
    let consentTemplates: Map<string, fhir4.Questionnaire> = await this.getConsentTemplatesResources();

    // create token
    let token = await this.sessionService.createToken(
      "searchConsents", {}
    ).toPromise();

    let result: Consent[] = [];
    return this.client.search({
      resourceType: 'Consent',
      searchParams: {'patient:identifier': 'http://localhost/id/' + idType + '|' + idString},
      headers: {'Authorization': 'MainzellisteToken ' + token.id}
    })
    .then(resource => {
      let bundle: fhir4.Bundle<fhir4.Consent> = resource as fhir4.Bundle<fhir4.Consent>
      return bundle.entry?.forEach(r => {
        let templateIds = this.findConsentTemplateId(r.resource?.policy || []);
        let template = [...consentTemplates].find(([k, v]) => templateIds.find(id => id == k)) || [];
        let endDate = r.resource?.provision?.period?.end;
        let startDate = r.resource?.provision?.period?.start;
        result.push({
          id: r.resource?.id,
          title: template[1]?.title || "",
          createdAt: new Date(r.resource?.dateTime || ""),
          validFrom: startDate && startDate.trim().length > 0 ? new Date(startDate) : undefined,
          validUntil: endDate && endDate.trim().length > 0 ? new Date(endDate) : undefined,
          period: 0,
          version: r.resource?.meta?.versionId,
          items: [],
          fhirResource: r.resource,
          templateName: template[0] || ""
        });
      }) || result;
    })
    .catch( error => this.handleException(error, result));
  }

  private findConsentTemplateId(fhirPolicies: fhir4.ConsentPolicy[]): string[] {
    let results: string[] = [];
    //this.mainzellisteBaseUrl + "/fhir"
    fhirPolicies.forEach(p => {
      // check url
      let uriFragments: string[] = p.uri?.split(this.mainzellisteBaseUrl + "/fhir/Questionnaire/") || [];
      if (uriFragments.length == 2) {
        results.push(uriFragments[1]);
      } else if ((p.uri?.split("Questionnaire/") || []).length == 2) {
        uriFragments = p.uri?.split("Questionnaire/") || [];
        // addd only if relative
        if (uriFragments[0] == "" || uriFragments[0] == "/") {
          results.push(uriFragments[1]);
        }
      } else {
        results.push(p.uri || "");
      }
    });
    return results;
  }

  public getConsentTemplates(): Promise<Map<string, ConsentTemplate>> {
    return this.getConsentTemplatesResources().then(entries => {
      let result: Map<string, ConsentTemplate> = new Map();
      entries.forEach((v, k) => {
        result.set(k, {
          id: v.id || "",
          name: v.name || "",
          title: v.title || "",
          definition: v
        })
      });
      return result;
    });
  }

  /**
   * return a map of content templates
   */
  private getConsentTemplatesResources(): Promise<Map<string, fhir4.Questionnaire>> {
    let result = new Map();
    return this.client.search({resourceType: 'Questionnaire'})
    .then(resource => {
      let bundle: fhir4.Bundle<fhir4.Questionnaire> = resource as fhir4.Bundle<fhir4.Questionnaire>
      return bundle.entry?.forEach(r => result.set(r.resource?.name, r.resource!)) || result;
    })
    .catch(error => this.handleException(error, result));
  }

  //////////////////////////////
  ////    DRAFT
  //////////////////////////////

  private handleException<R>(error:any, result:R):R {
    if (error instanceof TypeError) {
      let typeError: TypeError = error;
      console.log("error name: " + typeError.name);
      console.log("error msg: " + typeError.message);
      console.log("error stack: " + typeError.stack);
    }
    console.log(error);
    return result;
  }

  /**
   * Handle operation that failed.
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

  private log(message: string) {
    // this.messageService.add(`ConsentService: ${message}`);
  }
}
