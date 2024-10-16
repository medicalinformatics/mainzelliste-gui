import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import Client from 'fhir-kit-client'
import {SessionService} from "../services/session.service";
import {DatePipe} from "@angular/common";
import {AppConfigService} from "../app-config.service";
import {
  Consent,
  ConsentChoiceItem,
  ConsentDisplayItem,
  ConsentItem,
  ConsentStatus,
  ConsentsView
} from "./consent.model";
import {FhirResource, SearchParams} from "fhir-kit-client/types/index"
import {TranslateService} from '@ngx-translate/core';
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessage, ErrorMessages} from "../error/error-messages";
import _moment from "moment";
import {ConsentTemplateFhirWrapper} from "../model/consent-template-fhir-wrapper";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {ChoiceItem, ConsentTemplate, DisplayItem, Validity} from "./consent-template.model";
import {catchError, finalize, map, mergeMap} from "rxjs/operators";
import {ConsentPolicySet} from "../model/consent-policy-set";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ConsentPolicy} from "../model/consent-policy";
import {getErrorMessageFrom} from "../error/error-utils";
import {TokenType} from "../model/token";
import {TokenData} from "../model/token-data";
import {UploadConsentFileResponse} from "../model/api/upload-consent-file-response";

@Injectable({
  providedIn: 'root'
})

export class ConsentService {
  private readonly mainzellisteBaseUrl: string;
  private client: Client;
  private uploadConsentScanErrorMessages: ErrorMessage[] = [
    ErrorMessages.FAILED_UPLOAD_CONSENT_SCAN_FILE
  ];

  constructor(
    private sessionService: SessionService,
    private appConfigService: AppConfigService,
    private translate: TranslateService,
    private httpClient: HttpClient
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
   * @param force
   */
  public serializeConsentDataModelToFhir(dataModel: Consent, force: boolean) {
    if (dataModel.fhirResource !== undefined) {
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
      // is Mii fhir profile
      let isMiiResource = dataModel.fhirResource.meta?.profile?.some( url => url === "https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-einwilligung") || false

      //set fhir consent provisions from ui data model
      let rejected = true;
      dataModel.items.filter(i => i instanceof ConsentChoiceItem)
      .map(i => i as ConsentChoiceItem)
      .forEach(i => {
        if (i.answer == 'permit')
          rejected = false;

        let templateProvisions = dataModel.templateFhirResource?.provision?.provision?.filter(p => this.containLinkId(p, i.linkId)) ?? [];

        // find provisions with the given linkedId
        let useLinkId = false;
        let provisions = dataModel.fhirResource?.provision?.provision?.filter(p => {
          useLinkId = p.extension?.some(ext => ext.url = "http://hl7.org/fhir/StructureDefinition/originalText") ?? false;
          return useLinkId ? p.extension?.some(ext =>
              ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
              ext.valueString == i.linkId) :
            p.code?.every(c => templateProvisions.some( tp => tp.code?.some(tc => this.compareCodes(tc, c))))
        }) ?? [];

        // else find codes related to the search module

        // set provision type : denied or permit
        for(let p of provisions) {
          p.type = i.answer;
        }

        // add missing policies or provisions
        if(!isMiiResource || i.answer == 'permit'){
          if(dataModel.fhirResource != null && dataModel.fhirResource?.provision != undefined && dataModel.fhirResource?.provision.provision == undefined)
              dataModel.fhirResource.provision.provision = [];

          for(let templateProvision of templateProvisions){
            // find non-existing policies
            let nonExistingPolicies = templateProvision.code?.filter(tc =>
              provisions.every( p => !p?.code?.some(c => this.compareCodes(c, tc))
            )) ?? [];

            // add missing provision and policies (codes)
            if(nonExistingPolicies.length > 0){
              let provision = templateProvision
              provision.code = nonExistingPolicies;
              if(!useLinkId)
                provision.extension = provision.extension?.filter(ext => ext.url != "http://hl7.org/fhir/StructureDefinition/originalText")?? []
              dataModel.fhirResource?.provision?.provision?.push(provision);
              // set answer
              provision.type = i.answer;
            }
          }
        }
      })

      //remove denied provisions if Mii fhir profile
      if(isMiiResource && dataModel.fhirResource.provision != undefined)
        dataModel.fhirResource.provision.provision = dataModel.fhirResource.provision?.provision?.filter(p => p.type  == 'permit') || undefined

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

  private compareProvision(provision: fhir4.ConsentProvision, templateProvision: fhir4.ConsentProvision) {
    return provision.code?.some(c => templateProvision.code?.some(tc => this.compareCodes(c, tc)));
  }

  private compareCodes(firstCode: fhir4.CodeableConcept, secondCode: fhir4.CodeableConcept){
    return firstCode.coding?.some(c => secondCode.coding?.some(tc =>
      c.system?.toLowerCase() == tc.system?.toLowerCase() && c.code?.toLowerCase() == tc.code?.toLowerCase()
    ))
  }

  public containLinkId(provision: fhir4.ConsentProvision, moduleId:string|undefined)
  {
    return provision.extension?.some(ext =>
      ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
      ext.valueString == moduleId)
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) and consent fhir resource to ui data model
   * @param questionnaire fhir consent template resource
   * @param fhirConsent fhir consent resource
   */
  private deserializeConsentDataModelFrom(questionnaire: fhir4.Questionnaire, fhirConsent: fhir4.Consent | undefined): Consent {
    if (questionnaire == undefined) {
      this.handleError<any>(this.translate.instant('error.consent_service_questionnaire_not_found'));
      return {
        id: "",
        title: "NOT FOUND",
        createdAt: new Date(),
        validFrom: _moment(),
        period: 0,
        items: [],
        status: "active",
        templateId: "0",
        scans: new Map<string, string>(),
        scanUrls: new Map<string, string>()
      };
    }

    let initNewDataModel = false;
    if (questionnaire.contained == undefined || questionnaire.contained.length > 1
      || questionnaire.contained.length == 0) {
      throw new Error("Contained consent resource not found");
    }

    if (!fhirConsent) {
      fhirConsent = questionnaire.contained[0] as fhir4.Consent;
      //init date
      fhirConsent.dateTime = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')!;
      initNewDataModel = true;
    }

    let templateMap: Map<string, fhir4.CodeableConcept[]>  = this.extractTemplateMap(!fhirConsent ? fhirConsent : questionnaire.contained[0] as fhir4.Consent);

    // init template items: display text and questions
    let items: ConsentItem[] = [];
    questionnaire.item?.forEach(item => {
      if (item.type == 'display') {
        let displayItem: ConsentDisplayItem = new ConsentDisplayItem(item.linkId, item.text || "")
        items.push(displayItem);
      } else if (item.type == 'choice') {

        let answer: "deny" | "permit" | undefined;

        let templateCodes : fhir4.CodeableConcept[] = templateMap.get(item.linkId) ?? [];

        // find provision codes and type with the current linkedId
        let codes = fhirConsent?.provision?.provision?.filter(p =>
          p.extension?.some(ext => ext.url = "http://hl7.org/fhir/StructureDefinition/originalText") ?
            p.extension.some(ext =>
              ext.url == "http://hl7.org/fhir/StructureDefinition/originalText" &&
              ext.valueString == item.linkId) :
            p.code?.every(c => templateCodes.some( tc => this.compareCodes(tc, c)))
        )
        .reduce((previousValue, currentValue) => {
          (currentValue.code ?? []).forEach( c =>
            previousValue.push({code: c, answer: currentValue.type === 'permit'}))
          return previousValue;
        }, [] as {code: fhir4.CodeableConcept, answer: boolean}[]) ?? [];

        // Not: codes from consent resource was previously checked in the backend and each of them
        // should be included in the code list from the template
        // TODO support mixed response of codes belonging to the same modules
        answer = codes.every( i =>  i.answer) && codes.length == templateCodes.length ? 'permit' : 'deny';

        items.push(new ConsentChoiceItem(item.linkId, item.text ?? "", answer));
      } else {
        throw Error(`questionnaire item type [${item.type}] not support yet`)
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
      version: fhirConsent?.meta?.versionId,
      templateId: questionnaire?.id || "0",
      scans: new Map<string, string>(),
      scanUrls: new Map<string, string>(),
      templateFhirResource: questionnaire?.contained[0] as fhir4.Consent || undefined
    };
  }

  public extractTemplateMap(fhirConsent: fhir4.Consent): Map<string, fhir4.CodeableConcept[]> {
    return fhirConsent.provision?.provision?.map(p => {
      return {linkId: this.extractLinkId(p.extension), codes: p?.code || []}
    })
    .reduce((previousValue, currentValue) => {
      let currentList = previousValue.get(currentValue.linkId)
      if(currentList == undefined){
        currentList = [];
        previousValue.set(currentValue.linkId, currentList);
      }
      currentList.push(...currentValue.codes)
      return previousValue;
    }, new Map<string, fhir4.CodeableConcept[]>()) || new Map();
  }

  public extractLinkId(extension: fhir4.Extension[] | undefined) {
    return extension?.find(ext =>
      ext.url == "http://hl7.org/fhir/StructureDefinition/originalText")?.valueString || "";
  }

  /**
   * deserialize contained consent resource
   * @param consentTemplateId consent template id
   */
  public getNewConsentDataModel(consentTemplateId: string): Observable<Consent> {
    return this.getConsentTemplate(consentTemplateId).pipe(
      map( t => this.deserializeConsentDataModelFrom(t, undefined))
    );
  }

  public addConsent(dataModel: Consent): Observable<FhirResource> {
    if (dataModel.fhirResource == undefined) {
      this.handleError<any>(this.translate.instant('error.consent_service_fhir_consent_not_found'));
      return of({id: "", title: "NOT FOUND", date: new Date(), items: []} as unknown as fhir4.Consent);
    } else {
      // set patient id in fhir resource
      dataModel.fhirResource.patient = {
        identifier: this.convertToFhirIdentifier(dataModel.patientId)
      }

      //conditional update
      this.serializeConsentDataModelToFhir(dataModel, true);
      return this.updateFhirResource<fhir4.Consent>("editConsent", {}, 'Consent',
        dataModel.fhirResource, {
        'patient:identifier': dataModel.fhirResource.patient.identifier?.system + '|' + dataModel.fhirResource.patient.identifier?.value,
        'policyUri': 'fhir/Questionnaire/' + dataModel.templateId});
    }
  }

  public convertToFhirIdentifier(id: { idType: string, idString: string} | undefined): fhir4.Identifier {
    return {
      system: this.mainzellisteBaseUrl + "/id/" + id?.idType,
      value: id?.idString
    }
  }

  public editConsent(dataModel: Consent, force: boolean): Observable<FhirResource> {
    if (dataModel.fhirResource == undefined) {
      throw new Error(this.translate.instant('error.consent_service_fhir_consent_not_found'));
    } else {
      try {
        this.serializeConsentDataModelToFhir(dataModel, force);
      } catch (e){
        return throwError(e);
      }
      return this.updateFhirResource<fhir4.Consent>("editConsent", {}, 'Consent', dataModel.fhirResource);
    }
  }

  public readConsent(id: string): Observable<Consent> {
    return this.readFhirResources<fhir4.Consent>("readConsent", {}, 'Consent', id,
      ErrorMessages.READ_CONSENT_FAILED).pipe(
      mergeMap(c => this.getConsentTemplate(this.findConsentTemplateId(c.policy || [])).pipe(
        map(t => this.deserializeConsentDataModelFrom(t, c))
      ))
    );
  }

  public deleteConsent(id: string): Observable<fhir4.Consent> {
    return this.executeDeleteFhirOperation<fhir4.Consent>("deleteConsent", {}, 'Consent', id,
        ErrorMessages.DELETE_CONSENT_NOT_FOUND) as Observable<fhir4.Consent>;
  }

  public getConsents(idType: string, idString: string): Observable<ConsentsView> {
    return this.getConsentTemplateTitleMap().pipe(
        mergeMap(consentTemplates =>
            this.searchFhirResources<fhir4.Consent>("searchConsents", {},
                'Consent', ErrorMessages.SEARCH_CONSENT_TEMPLATES_FAILED,
                {
                  'patient:identifier': this.appConfigService.getMainzellisteUrl() + '/id/' + idType + '|' + idString,
                  '_elements': 'id,meta,status,dateTime,policy,provision.period'
                })
            .pipe(
                map(fhirConsents => {
                  return fhirConsents.map(r => {
                    let templateId: string = this.findConsentTemplateId(r?.policy ?? []);
                    let endDate = r?.provision?.period?.end;
                    let startDate = r?.provision?.period?.start;
                    let validFrom: string = startDate && startDate.trim().length > 0 ? _moment(startDate).toDate().toLocaleDateString() : "??";
                    let validUntil: Date | undefined = endDate && endDate?.trim().length > 0 ? new Date(endDate) : undefined;
                    let period = this.translate.instant("consent_list.unlimited_period");
                    if (validUntil) {
                      period = validFrom + " - " + new Date(validUntil).toLocaleDateString();
                    }
                    return {
                      id: r?.id || "",
                      templateId: templateId,
                      title: consentTemplates.get(templateId) ?? "",
                      createdAt: new Date(r?.dateTime ?? "").toLocaleDateString(),
                      validityPeriod: period,
                      version: r?.meta?.versionId,
                      status: this.consentStatusToString(r?.status ?? "active", validUntil)
                    };
                  });
                }),
                mergeMap(consents => of(
                    {
                      consentTemplates: consentTemplates,
                      consentRows: consents
                    }
                ))
            )
        )
    )
  }

  private consentStatusToString(status: ConsentStatus, validUntil?: Date): string {
    return (validUntil != undefined && validUntil.getTime()  < new Date().getTime()) ? "inactive" : status;
  }

  private findConsentTemplateId(fhirPolicies: fhir4.ConsentPolicy[]): string {
    let results: string[] = fhirPolicies.map( p => p.uri?.split(new RegExp(`(${this.mainzellisteBaseUrl}|\/?)fhir\/Questionnaire\/`)) ?? [])
      .filter(uriFragments => uriFragments.length == 3)
      .map(uriFragments => uriFragments[2])
    if(results.length > 1)
      throw new Error(`Found multiple consent template references`);
    else if(results.length == 0)
      throw new Error(`Template id not found`);
    return results[0];
  }

  public getConsentTemplates(searchParams?: SearchParams): Observable<Map<string, ConsentTemplateFhirWrapper>> {
    return this.getConsentTemplatesResources(searchParams).pipe(
      map(entries => {
        let result: Map<string, ConsentTemplateFhirWrapper> = new Map();
        entries.forEach((v, k) => {
          result.set(k, {
            id: v.id ?? "",
            name: this.getResourceIdentifier(v.identifier),
            title: v.title ?? "",
            definition: v
          })
        });
        return result;
      })
    );
  }

  public getResourceIdentifier(identifiers: fhir4.Identifier[] | undefined): string {
    return identifiers != undefined && identifiers.length > 0 ? identifiers[0].value ?? "" : ""
  }

  public getConsentTemplateTitleMap(): Observable<Map<string, string>> {
    return this.getConsentTemplatesResources({'_elements': 'id,title', 'status': 'active'})
      .pipe(
        map(entries => {
          let result: Map<string, string> = new Map();
          entries.forEach((v, k) => result.set(k, v.title ?? ""))
          return result;
        })
      );
  }

  /**
   * return a map of content templates
   */
  private getConsentTemplatesResources(searchParam?:SearchParams): Observable<Map<string, fhir4.Questionnaire>> {
    return this.searchFhirResources<fhir4.Questionnaire>("searchConsentTemplates", {},
      'Questionnaire', ErrorMessages.SEARCH_CONSENT_TEMPLATES_FAILED, searchParam)
      .pipe(
        map(resources => {
          let result = new Map();
          resources.forEach(r => result.set(r?.id, r!));
          return result;
        })
      );
  }

  public addConsentTemplate(consentTemplate: ConsentTemplate): Promise<fhir4.FhirResource | fhir4.Questionnaire> {
    return this.sessionService.createToken(
      "addConsentTemplate", {}
    )
    .pipe(
      mergeMap(token => this.resolveAddConsentTemplateToken(token.id, this.mapConsentTemplate(consentTemplate))),
      catchError(e => {
        // handle failed token creation
        return throwError(e)
      })
    ).toPromise();
  }

  resolveAddConsentTemplateToken(tokenId: string | undefined, consentTemplate: fhir4.Questionnaire): Promise<fhir4.FhirResource | fhir4.Questionnaire> {
    return this.client.create({
      resourceType: 'Questionnaire', body: consentTemplate,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
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

  public getConsentTemplate(id: string): Observable<fhir4.Questionnaire> {
    return this.readFhirResources<fhir4.Questionnaire>("readConsentTemplate", {}, 'Questionnaire', id,
      ErrorMessages.READ_CONSENT_TEMPLATE_FAILED);
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
          uri: `fhir/Questionnaire/${template.name}`
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

    return {
      resourceType: "Questionnaire",
      status: template.status,
      contained: [fhirConsent],
      identifier: [
        {
          value: template.name
        }
      ],
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
      code: !item.policy ? [] : [
        {
          coding: [
            {
              code: item.policy.code,
              system: item.policySet?.externalId || `/consent-policies/${item.policySet?.id}`
            }
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

  public createFhirResource<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string, resource: F) : Observable<FhirResource> {
    return this.executeFhirOperation<F>(tokenType, tokenData, resourceType, resource, this.resolveAddFhirResourceToken, "create");
  }

  public updateFhirResource<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string,
                                                    resource: F, searchParams?:SearchParams) : Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
      .pipe(
        mergeMap(token => this.resolveEditFhirResourceToken(token.id, resourceType, resource, searchParams)),
        catchError((error) => this.handleFailedRequest(resourceType, error, ErrorMessages.CREATE_CONSENT_REJECTED, "update"))
      )
  }

  public readFhirResources<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string,
                                                     id: string, errorMessageType: ErrorMessage) : Observable<F> {
    return this.executeReadFhirOperation<F>(tokenType, tokenData, resourceType, id, errorMessageType) as Observable<F>;
  }

  public searchFhirResources<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string,
                                                     errorMessageType: ErrorMessage, searchParam?:SearchParams) : Observable<(F | undefined)[]> {
    let result : Observable<FhirResource> = this.executeSearchFhirOperation(tokenType, tokenData, resourceType,
      this.resolveSearchFhirResourceToken, "search", errorMessageType, searchParam);
    return (result as Observable<fhir4.Bundle<F>>).pipe(
      map( b => b.entry?.map(r => r.resource)||[])
    );
  }

  public executeReadFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      resourceType: string,
      id: string,
      errorMessageType: ErrorMessage,
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => this.resolveReadFhirResourceToken<F>(token.id, resourceType, id)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageType, "read"))
    )
  }

  public executeDeleteFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      resourceType: string,
      id: string,
      errorMessageType: ErrorMessage,
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => this.resolveDeleteFhirResourceToken<F>(token.id, resourceType, id)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageType, "delete"))
    )
  }

  public executeSearchFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      resourceType: string,
      resolveToken: (tokenId: string | undefined, resourceType: string, searchParam?: SearchParams) => Promise<FhirResource | F>,
      errorPrefix: string,
      errorMessageType: ErrorMessage,
      searchParam?: SearchParams
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => resolveToken(token.id, resourceType, searchParam)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageType, errorPrefix))
    )
  }

  private handleFailedRequest(resourceType: string, error: any, errorMessageType: ErrorMessage, errorPrefix: string) {
    if (error.response?.data != undefined) {
      let errorMessage = "";
      for (const issue of (error.response.data as fhir4.OperationOutcome).issue) {
        if (issue.severity == 'error')
          errorMessage += issue.diagnostics
      }
      return throwError(new MainzellisteError(errorMessageType, errorMessage));
    } else
      return throwError(new MainzellisteUnknownError(`Failed to ${errorPrefix} resource fhir/${resourceType}.
                    Cause: ${getErrorMessageFrom(error, this.translate)}`, error, this.translate))
  }

  public executeFhirOperation<F extends FhirResource>(tokenType: TokenType,
                                                      tokenData: TokenData,
                                                      resourceType: string,
                                                      resource: F,
                                                      resolveToken: (tokenId: string | undefined, resourceType: string, resource: F) => Promise<FhirResource | F>,
                                                      errorPrefix: string
  ) : Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
      .pipe(
        mergeMap(token => resolveToken(token.id, resourceType, resource)),
        catchError((error) =>
          throwError(new Error(`Failed to ${errorPrefix} resource fhir/${resourceType}. Cause: ${getErrorMessageFrom(error, this.translate)}`))
        )
      )
  }

  resolveAddFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, resource: F): Promise<FhirResource | F> => {
    return this.client.create<F>({
      resourceType: resourceType, body: resource,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
    })
  }

  resolveEditFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, resource: F, searchParams?: SearchParams): Promise<FhirResource | F> => {
    return this.client.update<F>({
      resourceType: resourceType, id: !searchParams? resource.id : undefined, body: resource,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}},
      searchParams
    })
  }

  resolveReadFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, id:string): Promise<FhirResource | F> => {
    return this.client.read({
      resourceType: resourceType,
      id: id,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
    })
  }

  resolveDeleteFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, id:string): Promise<FhirResource | F> => {
    return this.client.delete({
      resourceType: resourceType,
      id: id,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
    })
  }

  resolveSearchFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, searchParams?: SearchParams): Promise<FhirResource | F> => {
    return this.client.search({
      resourceType: resourceType,
      options: { headers: {'Authorization': 'MainzellisteToken ' + tokenId}},
      searchParams
    })
  }

  //////////////////////////////
  ////    Policies
  //////////////////////////////

  public getPolicySets(): Observable<ConsentPolicySet[]> {
    return this.getData<ConsentPolicySet>("searchConsentPolicySets", {}, "consent-policies");
  }

  public getPolicies(policySetId: string): Observable<ConsentPolicy[]> {
    return this.getData<ConsentPolicy>("searchConsentPolicies", {},   `consent-policies/${policySetId}/policy`);
  }

  public getData<T>(tokenType: TokenType, tokenData: TokenData, path : string) {
    return this.sessionService.createToken( tokenType, tokenData)
      .pipe(
        mergeMap(token => this.resolveToken<T>(token.id, path)),
        catchError((error) => {
          if (error.status >= 400 && error.status < 500) {
            return of([]);
          } else {
            return throwError(new Error(`Failed to fetch data from ${path}. Cause: ${getErrorMessageFrom(error, this.translate)}`));
          }
        })
      )
  }

  resolveToken<T>(tokenId: string | undefined, path : string): Observable<T[]> {
    return this.httpClient.get<{
      total: number,
      result: T[]
    }>(this.mainzellisteBaseUrl + "/" + path, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('mainzellisteApiVersion', '3.2')
        .set('Authorization', 'MainzellisteToken ' + tokenId)
    })
      .pipe(
        map(response => response.result)
      )
  }

  uploadConsentScanFile(file: File, callback: () => void){
    return this.sessionService.createToken("addConsentScan", {})
    .pipe(
      mergeMap(token => this.resolveAddConsentScanToken(token.id, file, callback))
    )
  }

  private resolveAddConsentScanToken(tokenId: string | undefined, file: File, callback: () => void) {
    const formData = new FormData();
    formData.append("file", file);
    return this.httpClient.post<UploadConsentFileResponse>(this.mainzellisteBaseUrl + "/sessions/"
      + this.sessionService.sessionId + "/pdf?tokenId=" + tokenId, formData, {
      headers: new HttpHeaders()
      .set('mainzellisteApiVersion', '3.2'),
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      catchError(e => {
        let errorMessage;
        if (e instanceof HttpErrorResponse && (e.status == 400)) {
          errorMessage = this.uploadConsentScanErrorMessages.find(msg => msg.match(e))
          // find error message arguments
          if( errorMessage == ErrorMessages.FAILED_UPLOAD_CONSENT_SCAN_FILE) {
            return throwError(new MainzellisteError(errorMessage, errorMessage.findVariables(e)[1]));
          }
        }
        return throwError(errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
      }),
      finalize(callback)
    );
  }

  uploadConsentScan(fileUrl: string, id: { idType: string, idString: string} | undefined) {
    let resource : fhir4.DocumentReference = {
      resourceType: "DocumentReference",
      meta: {
        profile: [
          "https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-documentreference"
        ]
      },
      status: "current",
      subject: {
        identifier: this.convertToFhirIdentifier(id)
      },
      content:  [
        {
          attachment: {
            contentType: "application/pdf",
            data: "YmFzZTY0Q29kaWVydGVzUERGRGVzVW50ZXJzY2hyaWViZW5lblBhdGllbnRlbkVpbndpbGxpZ3VuZ3Nib2dlbnM=",
            url: fileUrl
          }
        }
      ]
    };
    return this.createFhirResource<fhir4.DocumentReference>("addConsentScan", {}, 'DocumentReference', resource);
  }

  addConsentProvenance(id: string | undefined, docRefIds: (string | undefined)[]) {
    if(docRefIds == undefined || docRefIds.length == 0)
      return of();
    let resource : fhir4.Provenance = {
      resourceType: "Provenance",
      meta: {
        profile: [
          "https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-provenance"
        ]
      },
      target: [
        {
          reference: "Consent/" + id
        }
      ],
      recorded: _moment().format("YYYY-MM-DDThh:mm:ssZ"),
      agent: [
        {
          who: {
            display: "Mainzelliste - " + this.appConfigService.getVersion()
          }
        }
      ],
      entity: Array.from(docRefIds, (id) => (
        {
          role: "source",
          what: {
            reference: "DocumentReference/" + id
          }
        }
      ))
    }
    return this.createFhirResource<fhir4.Provenance>("addConsentProvenance", {}, 'Provenance', resource);
  }

  createScansAndProvenance(consent: Consent|undefined, consentId: string) {
    return forkJoin(
      Array.from(consent?.scanUrls?.values() ?? []).map(url =>
        this.uploadConsentScan(url, consent?.patientId))
    ).pipe(
      map(docRefs => docRefs?.map(docRef => (docRef as fhir4.DocumentReference).id) || []),
      mergeMap(docRefIds =>
        this.addConsentProvenance(consentId, docRefIds)
      )
    )
  }

  getConsentProvenance(versionedConsentId:string){
    return this.searchFhirResources<fhir4.Provenance>("searchConsentProvenances", {},
      'Provenance', ErrorMessages.SEARCH_CONSENT_PROVENANCE_FAILED,
      {
        'target': this.appConfigService.getMainzellisteUrl() + '/Consent/' + versionedConsentId
      });
  }

  getConsentScan(consentScanId:string){
    return this.readFhirResources<fhir4.DocumentReference>("readConsentScan", {},
      'DocumentReference', consentScanId, ErrorMessages.READ_CONSENT_SCAN_FAILED);
  }

  //////////////////////////////
  ////    DRAFT
  //////////////////////////////


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
