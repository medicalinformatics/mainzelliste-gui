import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import Client from 'fhir-kit-client'
import {SessionService} from "../services/session.service";
import {DatePipe} from "@angular/common";
import {AppConfigService} from "../app-config.service";
import {Consent, ConsentChoiceItem, ConsentDisplayItem, ConsentItem} from "./consent.model";
import {TranslateService} from '@ngx-translate/core';
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessages} from "../error/error-messages";
import _moment from "moment";
import {ConsentTemplateFhirWrapper} from "../model/consent-template-fhir-wrapper";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {ChoiceItem, ConsentTemplate, DisplayItem, Validity} from "./consent-template.model";

@Injectable({
  providedIn: 'root'
})

export class ConsentService {
  private readonly mainzellisteBaseUrl: string;
  private client: Client;

  constructor(
    private sessionService: SessionService,
    private appConfigService: AppConfigService,
    private translate: TranslateService
  ) {
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
  public serializeConsentDataModelToFhir(dataModel: Consent, force: boolean) {
    if (dataModel.fhirResource) {
      //set fhir consent date
      let datePipe: DatePipe = new DatePipe('en-US');
      dataModel.fhirResource.dateTime = datePipe.transform(dataModel.createdAt, 'yyyy-MM-dd')!;

      //set validity period
      let period = dataModel.fhirResource?.provision?.period;
      if (period == undefined || !period.end || period.end.trim().length < 1) {
        dataModel.fhirResource.provision!.period = {
          start: datePipe.transform(dataModel.validFrom?.toDate(), 'yyyy-MM-dd') || undefined
        }
      } else {
        let periodAsDate = 0;
        if ((period.start && period.start.trim().length > 0))
          periodAsDate = new Date(period.end).getTime() - new Date(period.start).getTime();
        dataModel.fhirResource.provision!.period = {
          start: datePipe.transform(dataModel.validFrom?.toDate(), 'yyyy-MM-dd') || undefined,
          end: datePipe.transform(new Date((dataModel.validFrom?.toDate().getTime() || 0) + periodAsDate), 'yyyy-MM-dd') || undefined
        }
      }

      //set fhir consent provisions from ui data model
      let rejected = true;
      dataModel.items.filter(i => i instanceof ConsentChoiceItem)
      .map(i => i as ConsentChoiceItem).forEach(i => {
        if (!dataModel.fhirResource?.provision) {
          this.handleError<fhir4.QuestionnaireResponse>(this.translate.instant('error.consent_service_fhir_consent_template'))
        } else if (dataModel.fhirResource.provision.provision) {
          // find provision with the given linkedId
          let provision = dataModel.fhirResource.provision.provision.find(p => {
            return p.extension?.find(ext => ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
              ext.valueString == i.linkId)
          });
          // set provision type : denied or permit
          if (provision) {
            if(i.answer == "permit")
              rejected = false;
            provision.type = i.answer;
          }
        }
      })

      //set status
      if (rejected) {
        if (!force)
          throw new MainzellisteError(ErrorMessages.CREATE_CONSENT_REJECTED);
        dataModel.fhirResource.status = "rejected";
      } else if (dataModel.fhirResource?.provision?.period.end != undefined
        && new Date(dataModel.fhirResource?.provision?.period.end).getTime() < new Date().getTime()) {
        if (!force)
          throw new MainzellisteError(ErrorMessages.CREATE_CONSENT_INACTIVE);
        dataModel.fhirResource.status = "inactive";
      } else
        dataModel.fhirResource.status = "active";
    }
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) to ui data model
   * @param template ui template data model
   */
  public getNewConsentDataModelFromTemplate(template: ConsentTemplateFhirWrapper | undefined): Consent {
    return this.deserializeConsentDataModelFrom(template?.definition, undefined);
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) and consent fhir resource to ui data model
   * @param questionnaire fhir consent template resource
   * @param fhirConsent fhir consent resource
   */
  private deserializeConsentDataModelFrom(questionnaire: fhir4.Questionnaire | undefined, fhirConsent: fhir4.Consent | undefined): Consent {
    if (questionnaire == undefined) {
      this.handleError<any>(this.translate.instant('error.consent_service_questionnaire_not_found'));
      return {
        id: "",
        title: "NOT FOUND",
        createdAt: new Date(),
        validFrom: _moment(),
        period: 0,
        items: [],
        status: "active"
      };
    }

    let initNewDataModel = false;
    if (!fhirConsent) {
      if (questionnaire.contained == undefined || questionnaire.contained.length > 1
        || questionnaire.contained.length == 0) {
        this.handleError<any>(this.translate.instant('error.consent_service_consent_resource_not_found'));
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
        this.handleError<any>(this.translate.instant('error.consent_service_questionnaire_item_type1') + ' [${item.type}] ' + this.translate.instant('error.consent_service_questionnaire_item_type2'));
      }
    })

    // calculate period from consent resource
    let fhirPeriod = fhirConsent?.provision?.period;
    let period;
    let validFrom = _moment();
    if (fhirPeriod == undefined || !fhirPeriod.end || fhirPeriod.end.trim().length < 1) {
      period = 0;
    } else if ((!fhirPeriod.start || fhirPeriod.start.trim().length < 1)) {
      period = new Date(fhirPeriod.end).getTime() - validFrom.toDate().getTime();
    } else {
      validFrom = !initNewDataModel ? _moment(fhirPeriod.start) : validFrom;
      period = new Date(fhirPeriod.end).getTime() - validFrom.toDate().getTime();
    }

    return {
      id: fhirConsent?.id,
      title: questionnaire?.title || "",
      createdAt: new Date(fhirConsent?.dateTime || ""),
      validFrom: validFrom,
      period: period,
      items: items,
      status: fhirConsent?.status || "active",
      fhirResource: fhirConsent,
      template: questionnaire
    };
  }

  public async addConsent(dataModel: Consent) {

    if (dataModel.fhirResource == undefined) {
      this.handleError<any>(this.translate.instant('error.consent_service_fhir_consent_not_found'));
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    //find if consent exist
    let consents = await this.getConsents(dataModel.patientId?.idType!, dataModel.patientId?.idString!);
    let existingConsent = consents.find( c => c.templateName == dataModel.template?.name);
    if(existingConsent && existingConsent.fhirResource){
      // id consent exist update
      dataModel.fhirResource = existingConsent.fhirResource;
      return this.editConsent(dataModel, true);
    } else {
      // set patient id
      dataModel.fhirResource.patient = {
        identifier: {
          system: this.mainzellisteBaseUrl + "/id/" + dataModel.patientId?.idType,
          value: dataModel.patientId?.idString
        }
      }
    }

    this.serializeConsentDataModelToFhir(dataModel, true);

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

  public async editConsent(dataModel: Consent, force: boolean) {

    if (dataModel.fhirResource == undefined) {
      this.handleError<any>(this.translate.instant('error.consent_service_fhir_consent_not_found'));
      return {id: "", title: "NOT FOUND", date: new Date(), items: []};
    }

    this.serializeConsentDataModelToFhir(dataModel, force);

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
      this.handleError<any>(this.translate.instant('error.consent_service_fhir_consent_not_found'));
      return {
        id: "",
        title: "NOT FOUND",
        createdAt: new Date(),
        validFrom: _moment(),
        period: 0,
        items: [],
        status: "active"
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
      searchParams: {'patient:identifier': this.appConfigService.getMainzellisteUrl() + '/id/' + idType + '|' + idString},
      options: {
        headers: {'Authorization': 'MainzellisteToken ' + token.id}
      }
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
          validFrom: startDate && startDate.trim().length > 0 ? _moment(startDate) : undefined,
          validUntil: endDate && endDate.trim().length > 0 ? new Date(endDate) : undefined,
          status: r.resource?.status || "active",
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

  public getConsentTemplates(): Promise<Map<string, ConsentTemplateFhirWrapper>> {
    return this.getConsentTemplatesResources().then(entries => {
      let result: Map<string, ConsentTemplateFhirWrapper> = new Map();
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

  public addConsentTemplate(consentTemplate: ConsentTemplate): Promise<fhir4.FhirResource | fhir4.Questionnaire> {
    return this.resolveAddConsentTemplateToken("", this.mapConsentTemplate(consentTemplate));
  }

  resolveAddConsentTemplateToken(tokenId: string | undefined, consentTemplate: fhir4.Questionnaire): Promise<fhir4.FhirResource | fhir4.Questionnaire> {
    return this.client.create({
      resourceType: 'Questionnaire', body: consentTemplate
    })
      .then(resource => resource as fhir4.Consent)
      .catch(e => {
        if(e.response?.data != undefined) {
          let errorMessage = "";
          for(const issue of (e.response.data as fhir4.OperationOutcome).issue) {
            if(issue.severity == 'error')
              errorMessage += issue.diagnostics
          }
          throw new MainzellisteError(ErrorMessages.CREATE_CONSENT_TEMPLATE_REJECTED, errorMessage);
        } else
          throw new MainzellisteUnknownError("Failed to create consent template", e, this.translate);
      })
  }

  public mapConsentTemplate(template:ConsentTemplate): fhir4.Questionnaire {

    let fhirConsent: fhir4.Consent = {
      resourceType: "Consent",
      id: "100",
      status: "active",
      scope: {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/consentscope",
            "code": "research"
          }
        ]
      },
      category: [
        {
          coding: [
            {
              "system": "http://loinc.org",
              "code": "57016-8"
            }
          ]
        }
      ],
      patient: {
        "reference": "Patient/101"
      },
      dateTime: "2020-09-01",
      policy: [
        {
          uri: `/Questionnaire/${template.name}`
        }
      ],
      provision: {
        type: "deny",
        period: {
          start: _moment().format("YYYY-MM-DD"),
          end: this.mapValidityToDate(template.validity)
        },
        provision: template.items.filter(i => i instanceof ChoiceItem)
          .map(i => this.mapChoiceItemToProvision((i as ChoiceItem), template.validity))
      }
    };

    // set organization
    if (template.organization != undefined && template.organization.trim().length > 0) {
      fhirConsent.organization = [{
        display: template.organization
      }]
    }

    // set research study
    if (template.researchStudy != undefined && template.researchStudy.trim().length > 0) {
      fhirConsent.extension = [
        {
          url: "http://fhir.de/ConsentManagement/StructureDefinition/DomainReference",
          extension: [
            {
              url: "domain",
              valueReference: {
                reference: "ResearchStudy/d7a65ce8-2810-401a-b0db-70782a7b19a6",
                display: template.researchStudy
              }
            },
            {
              url: "status",
              valueCoding: {
                system: "http://hl7.org/fhir/publication-status",
                code: "active"
              }
            }
          ]
        }
      ]
    }

    // set mii specific elements
    if (template.isMiiFhirConsentConform) {
      fhirConsent.meta = {
        profile: [
          "https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-einwilligung"
        ]
      };
      //TODO scope must be always : (Code=research) (System=http://terminology.hl7.org/CodeSystem/consentscope)
      fhirConsent.category.push({
        coding: [
          {
            "system": "https://www.medizininformatik-initiative.de/fhir/modul-consent/CodeSystem/mii-cs-consent-consent_category",
            "code": "2.16.840.1.113883.3.1937.777.24.2.184"
          }
        ]
      });
      fhirConsent.policy?.push({
        uri: template.policy
      })
    } else {
      //set default profile: de.einwilligungsmanagement 1.0.2
      fhirConsent.meta = {
        profile: [
          "http://fhir.de/ConsentManagement/StructureDefinition/Consent"
        ]
      }
    }

    //TODO if publish -> status: "active" otherwise status is draft
    return {
      resourceType: "Questionnaire",
      status: template.status,
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/artifact-url",
          valueUri: "#100"
        }
      ],
      contained: [fhirConsent],
      name: template.name,
      title: template.title,
      subjectType: ["Consent"],
      item: template.items.map(i => {
        if (i instanceof DisplayItem)
          return this.mapDisplayItem(i);
        else if (i instanceof ChoiceItem)
          return this.mapChoiceItemToQuestionnaireItem(i);
        else {
          console.log(i);
          throw new Error("item no supported" + i)
        }
      })
    };
  }

  private mapChoiceItemToProvision(item: ChoiceItem, validity:Validity): fhir4.ConsentProvision {
    return {
      type: "permit",
      period: {
        start: _moment().format("YYYY-MM-DD"),
        end: this.mapValidityToDate(validity)
      },
      code: !item.fhirCoding ? [] : [
        {
          coding: [
            item.fhirCoding
          ]
        }
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/originalText",
          valueString: `${item.id}`
        }
      ]
    };
  }

  private mapChoiceItemToQuestionnaireItem(item: ChoiceItem): fhir4.QuestionnaireItem {
    return {
      linkId: `${item.id}`,
      type: `${item.type}`,
      text: item.text,
      answerOption: [
        {
          valueCoding: {
            system: "http://hl7.org/fhir/consent-provision-type",
            code: "permit",
            display: "Ja"
          }
        },
        {
          valueCoding: {
            system: "http://hl7.org/fhir/consent-provision-type",
            code: "deny",
            display: "Nein"
          }
        }
      ]
    };
  }

  private mapDisplayItem(item: DisplayItem): fhir4.QuestionnaireItem {
    return {
      linkId: `${item.id}`,
      type: `${item.type}`,
      text: item.text
    };
  }

  mapValidityToDate(validityPeriod: Validity): string {
    let now = _moment();
    return now.add(validityPeriod.day || 0, 'days')
      .add(validityPeriod.month || 0, 'months')
      .add(validityPeriod.year || 0, 'years')
      .format("YYYY-MM-DD")
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
