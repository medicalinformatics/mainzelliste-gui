import {Inject, Injectable} from '@angular/core';
import {forkJoin, lastValueFrom, Observable, of, range, throwError} from 'rxjs';
import Client from 'fhir-kit-client'
import {SessionService} from "../services/session.service";
import {DatePipe} from "@angular/common";
import {AppConfigService} from "../app-config.service";
import {
  Consent,
  ConsentChoiceItem,
  ConsentDisplayItem,
  ConsentHistoryRow,
  ConsentItem,
  ConsentStatus,
  ConsentsView
} from "./consent.model";
import {FhirResource, SearchParams} from "fhir-kit-client/types/index"
import {TranslateService} from '@ngx-translate/core';
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessage, ErrorMessages} from "../error/error-messages";
import {ConsentTemplateFhirWrapper} from "../model/consent-template-fhir-wrapper";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {ChoiceItem, ConsentTemplate, DisplayItem, PolicyView} from "./consent-template.model";
import {catchError, finalize, map, mergeMap, reduce} from "rxjs/operators";
import {ConsentPolicySet} from "../model/consent-policy-set";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ConsentPolicy} from "../model/consent-policy";
import {getErrorMessageFrom} from "../error/error-utils";
import {TokenType} from "../model/token";
import {TokenData} from "../model/token-data";
import {UploadConsentFileResponse} from "../model/api/upload-consent-file-response";
import * as querystring from "querystring";
import {AuthorizationService} from "../services/authorization.service";
import {DateTime} from "luxon";
import {StringUtils} from "../shared/utils/string-utils";
import {ConsentValidityPeriod, Validity} from "./consent-validity-period";
import {MAT_DATE_LOCALE} from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})

export class ConsentService {
  private readonly mainzellisteBaseUrl: string;
  private readonly client: Client;
  private readonly uploadConsentScanErrorMessages: ErrorMessage[] = [
    ErrorMessages.FAILED_UPLOAD_CONSENT_SCAN_FILE
  ];
  private static readonly POLICY_SET_PATH: string = "/consent-policies/";

  constructor(
    private readonly sessionService: SessionService,
    private readonly authorizationService:AuthorizationService,
    private readonly appConfigService: AppConfigService,
    private readonly translate: TranslateService,
    private readonly httpClient: HttpClient,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.mainzellisteBaseUrl = this.appConfigService.data[0].url.toString();
    this.client = new Client({baseUrl: this.mainzellisteBaseUrl + "/fhir"});
  }

  /**
   * serialize ui change in consent fhir resource
   * @param dataModel
   * @param force
   */
  public serializeConsentDataModelToFhir(dataModel: Consent, force: boolean) {
    if (dataModel.fhirResource !== undefined) {
      //set fhir consent date in following pattern 'yyyy-MM-dd'
      dataModel.fhirResource.dateTime = DateTime.fromJSDate(dataModel.createdAt).toISODate() ?? undefined;

      //set validity period
      dataModel.fhirResource.provision!.period = {
        start: dataModel.validityPeriod.validFrom?.toISODate() ?? undefined,
        end: dataModel.validityPeriod.validUntil?.toISODate() ?? undefined,
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

        // find all provisions from the template with the same module id (i.linkId)
        let templateProvisions = dataModel.templateFhirResource?.provision?.provision?.filter(p => this.containLinkId(p, i.linkId)) ?? [];

        let useModuleIdExtension = false;
        // filter
        let provisions = dataModel.fhirResource?.provision?.provision?.filter(p => {
          useModuleIdExtension = p.extension?.some(ext => ext.url = "http://hl7.org/fhir/StructureDefinition/originalText") ?? false;
          return useModuleIdExtension ? this.containLinkId(p, i.linkId) :
            p.code?.every(c => templateProvisions.some( tp => tp.code?.some(tc => this.compareCodes(tc, c))))
        }) ?? [];

        for(let p of provisions) {
          // set provision type : denied or permit
          p.type = i.answer;
          // set validity period
          if (p.period) {
            p.period = {
              start : dataModel.fhirResource?.provision?.period?.start,
              end : this.calculateProvisionEndDate(p.period, dataModel.fhirResource?.provision?.period)
            }
          }
        }

        // add missing policies from template
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
              // set answer
              provision.type = i.answer;
              // set validity period
              if (provision.period) {
                provision.period = {
                  start : dataModel.fhirResource?.provision?.period?.start,
                  end : this.calculateProvisionEndDate(provision.period, dataModel.fhirResource?.provision?.period)
                }
              }
              //remove the extension with module id (linkId)
              if(!useModuleIdExtension)
                provision.extension = provision.extension?.filter(ext => ext.url != "http://hl7.org/fhir/StructureDefinition/originalText")?? []

              dataModel.fhirResource?.provision?.provision?.push(provision);
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

  private calculateProvisionEndDate(provisionValidityPeriod: fhir4.Period,
                                    consentValidityPeriod: fhir4.Period | undefined) : string | undefined {
    if (!provisionValidityPeriod?.end || StringUtils.isEmpty(provisionValidityPeriod.end))
      return consentValidityPeriod?.end
    else if (provisionValidityPeriod?.start && !StringUtils.isEmpty(provisionValidityPeriod?.start)) {
      const validityPeriod = this.deserializeTemplateValidity(provisionValidityPeriod.start, provisionValidityPeriod.end);
      return this.addPeriodToDate(consentValidityPeriod?.start ?? "", validityPeriod).toISODate() ?? undefined;
    } else
      return undefined;
  }

  /**
   * deserialize consent template (fhir Questionnaire resource) and consent fhir resource to ui data model
   * @param questionnaire fhir consent template resource
   * @param fhirConsent fhir consent resource
   */
  private deserializeConsentDataModelFrom(questionnaire: fhir4.Questionnaire, fhirConsent: fhir4.Consent | undefined): Consent {
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

    let questionIdsToPoliciesMap: Map<string, fhir4.CodeableConcept[]>  = this.extractQuestionIdsToPoliciesMap(questionnaire.contained[0] as fhir4.Consent);

    // init template items: display text and questions
    let items: ConsentItem[] = questionnaire.item?.filter( i => ['display', 'choice'].includes(i.type))
    .map(item => {
      if (item.type == 'display') {
        return new ConsentDisplayItem(item.linkId, item.text ?? "");
      } else {
        let answer: "deny" | "permit" | undefined;

        let templateCodes : fhir4.CodeableConcept[] = questionIdsToPoliciesMap.get(item.linkId) ?? [];

        // find provision codes and type with the current linkedId
        let codes = fhirConsent?.provision?.provision?.filter(p =>
          p.extension?.some(ext => ext.url = "http://hl7.org/fhir/StructureDefinition/originalText") ?
            this.containLinkId(p, item.linkId) :
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

        return new ConsentChoiceItem(item.linkId, item.text ?? "", answer);
      }
    }) ?? [];

    // calculate period from consent resource
    let fhirPeriod = fhirConsent?.provision?.period;
    let validityPeriod: ConsentValidityPeriod = { validFrom : DateTime.now() };

    if (fhirPeriod?.end && !StringUtils.isEmpty(fhirPeriod.end)) {
      if (!fhirPeriod?.start || StringUtils.isEmpty(fhirPeriod.start)) {
        // fixed end date
        validityPeriod.validUntil = DateTime.fromISO(fhirPeriod.end);
      } else {
        // defined period
        validityPeriod.period = this.deserializeTemplateValidity(fhirPeriod?.start ?? "", fhirPeriod?.end ?? "");
        if(!initNewDataModel)
          validityPeriod.validFrom = DateTime.fromISO(fhirPeriod.start);
        validityPeriod.validUntil = this.addPeriodToDate(validityPeriod.validFrom.toISODate() ?? "", validityPeriod.period)
      }
    }

    return new Consent(
      questionnaire?.title ?? "",
      new Date(fhirConsent?.dateTime ?? ""),
      validityPeriod,
      items,
      fhirConsent?.status || "active",
      questionnaire?.id ?? "0",
      new Map<string, string>(),
      new Map<string, string>(),
      fhirConsent?.id,
      fhirConsent?.meta?.versionId,
      undefined,
      fhirConsent,
      questionnaire?.contained[0] as fhir4.Consent || undefined)
  }

  public extractQuestionIdsToPoliciesMap(fhirConsent: fhir4.Consent): Map<string, fhir4.CodeableConcept[]> {
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
      throw new Error(this.translate.instant('error.consent_service_fhir_consent_not_found'));
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

  public updateConsent(dataModel: Consent, force: boolean, searchParams?:SearchParams): Observable<FhirResource> {
    if (dataModel.fhirResource == undefined) {
      throw new Error(this.translate.instant('error.consent_service_fhir_consent_not_found'));
    } else {
      try {
        this.serializeConsentDataModelToFhir(dataModel, force);
      } catch (e){
        return throwError( () => e);
      }
      return this.updateFhirResource<fhir4.Consent>("editConsent", {}, 'Consent', dataModel.fhirResource, searchParams);
    }
  }

  public readConsent(id: string, version? :string): Observable<Consent> {
    return this.readFhirResources<fhir4.Consent>("readConsent", {},
      [ErrorMessages.READ_CONSENT_FAILED], 'Consent', id, version).pipe(
      mergeMap(c => this.getConsentTemplate(this.findConsentTemplateId(c.policy || [])).pipe(
        map(t => this.deserializeConsentDataModelFrom(t, c))
      ))
    );
  }

  public readConsentHistory(id:string, version: number): Observable<ConsentHistoryRow[]> {
    return this.sessionService.createToken("readConsent", {}, version)
    .pipe(
      mergeMap(token => this.resolveReadConsentHistory(token.id, id, version)),
      catchError((error) => this.handleFailedRequest("Consent", error, [ErrorMessages.READ_CONSENT_FAILED], "read"))
    );
  }

  public resolveReadConsentHistory(tokenId: string | undefined, id: string, version: number): Observable<ConsentHistoryRow[]> {
    return range(1, version - 1)
    .pipe(
      mergeMap(v => this.resolveReadFhirResourceToken<fhir4.Consent>(
        tokenId, "Consent", id, v + '?_elements=id,meta,dateTime,status')),
      map(r => {
        return {
          id: id,
          lastUpdated: new Date(r?.meta?.lastUpdated ?? "").toLocaleString(this._locale,
            {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"}),
          version: parseInt(r?.meta?.versionId ?? "1"),
          status: r?.status || "active"
        }
      }),
      reduce((result: ConsentHistoryRow[], c) => {
        result.push(c)
        return result;
      }, []),
      map(result => result.sort((a, b) => {
        if (a.version == b.version)
          return 0;
        else
          return a.version > b.version ? -1 : 1
      }))
    )
  }

  public deleteConsent(id: string): Observable<fhir4.Consent> {
    return this.executeDeleteFhirOperation<fhir4.Consent>("deleteConsent", {}, 'Consent', id,
        [ErrorMessages.DELETE_CONSENT_NOT_FOUND, ErrorMessages.DELETE_CONSENT_SCANS_FAILED]) as Observable<fhir4.Consent>;
  }

  public getConsents(idType: string, idString: string): Observable<ConsentsView> {
    return this.getConsentTemplateTitleMap().pipe(
        mergeMap(consentTemplates =>
            this.searchFhirResources<fhir4.Consent>("searchConsents", {},
                'Consent', [ErrorMessages.SEARCH_CONSENT_TEMPLATES_FAILED],
                {
                  'patient:identifier': this.appConfigService.getMainzellisteUrl() + '/id/' + idType + '|' + idString,
                  '_elements': 'id,meta,status,dateTime,policy,provision.period'
                })
            .pipe(
                map(fhirConsents => {
                  return fhirConsents.filter(
                    r => consentTemplates.has(this.findConsentTemplateId(r?.policy ?? []))
                  ).map(r => {
                    let templateId: string = this.findConsentTemplateId(r?.policy ?? []);
                    let validFrom = StringUtils.convertDateFromISOToLocale(r?.provision?.period?.start, this._locale, true);
                    let validUntil = StringUtils.parseISODate( r?.provision?.period?.end);
                    let period = !validUntil ? this.translate.instant("consent_list.unlimited_period"):
                      validFrom + " - " + StringUtils.convertDateToLocale(validUntil, this._locale, true);
                    return {
                      id: r?.id ?? "",
                      templateId: templateId,
                      title: consentTemplates.get(templateId) ?? "",
                      createdAt: StringUtils.convertDateFromISOToLocale(r?.dateTime, this._locale, true) ?? "??",
                      validityPeriod: period,
                      version: parseInt(r?.meta?.versionId ?? "1"),
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
    return this.getConsentTemplatesResources({'_elements': 'id,title,identifier', 'status': 'active'})
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
    const consentTemplateIds = this.authorizationService.getTenantConsentTemplate();
    return this.searchFhirResources<fhir4.Questionnaire>("searchConsentTemplates", {},
      'Questionnaire', [ErrorMessages.SEARCH_CONSENT_TEMPLATES_FAILED], searchParam)
      .pipe(
        map(resources => {
          let result = new Map();
          resources.filter(r => consentTemplateIds.length == 0 ||
            consentTemplateIds.includes(this.getResourceIdentifier(r?.identifier)))
            .forEach(r => result.set(r?.id, r!));
          return result;
        })
      );
  }

  public addConsentTemplate(consentTemplate: ConsentTemplate): Promise<fhir4.FhirResource | fhir4.Questionnaire> {
    return lastValueFrom(this.sessionService.createToken(
      "addConsentTemplate", {}
    )
    .pipe(
      mergeMap(token => this.resolveAddConsentTemplateToken(token.id, this.mapConsentTemplate(consentTemplate))),
      catchError(e => {
        // handle failed token creation
        return throwError( () => e)
      })
    ));
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
    return this.readFhirResources<fhir4.Questionnaire>("readConsentTemplate", {},
      [ErrorMessages.READ_CONSENT_TEMPLATE_FAILED], 'Questionnaire', id);
  }

  public deleteConsentTemplate(id: string): Observable<fhir4.Questionnaire> {
    return this.executeDeleteFhirOperation<fhir4.Questionnaire>("deleteConsentTemplate", {}, 'Questionnaire', id,
      [ErrorMessages.DELETE_CONSENT_TEMPLATE_REFERRED_BY], { "sureness": true }) as Observable<fhir4.Questionnaire>;
  }

  public mapConsentTemplate(template:ConsentTemplate): fhir4.Questionnaire {
    const today:string = DateTime.now().toISODate();
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
      policy: [],
      provision: {
        type: template.consentModel? "deny" : "permit",
        period: {
          start: today,
          end: this.mapValidityToDate(template.validity, today)
        },
        provision: template.items.filter(i => i instanceof ChoiceItem)
        .map(i => this.mapChoiceItemToProvision((i as ChoiceItem), template.validity, today))
        .reduce((a, v) => a.concat(v), [])
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
      version: template.version,
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

  private mapChoiceItemToProvision(item: ChoiceItem, validity:Validity, starDate: string): fhir4.ConsentProvision[] {
    return item.policies?.map(p => { return {
      type: item.answer,
      period: {
        start: starDate,
        end: this.mapValidityToDate(p.validity ?? validity, starDate)
      },
      code: !p ? [] : [
        {
          coding: [
            {
              code: p.code,
              system: p.policySet?.externalId || `${ConsentService.POLICY_SET_PATH}${p.policySet?.id}`,
              display: p.displayText
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
    }}) ?? [];
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

  public deserializeConsentTemplate(questionnaire: fhir4.Questionnaire) : ConsentTemplate{
    if(questionnaire.contained == undefined || questionnaire.contained.length == 0)
      return ConsentTemplate.createEmpty();
    const containedConsent: fhir4.Consent = questionnaire.contained[0] as fhir4.Consent
    return {
      name: this.getResourceIdentifier(questionnaire.identifier),
      version: questionnaire.version ?? "",
      title: questionnaire.title ?? "",
      status: questionnaire.status,
      items: questionnaire.item?.filter(item => item.type == 'display' || item.type == 'choice')
      .map((item, i) => item.type == 'display' ?
        new DisplayItem(i, 'display', item.text) :
        new ChoiceItem(i, 'choice', containedConsent.provision?.type == "deny"? 'deny' :'permit',
            item.text, containedConsent.provision?.provision?.filter(p =>
              p.extension?.some( ext => ext.url == "http://hl7.org/fhir/StructureDefinition/originalText"
                && ext.valueString == item.linkId)
            )
            .map( p => this.deserializeTemplatePolicies( p.code ?? [], this.deserializeTemplateValidity(p.period?.start ?? "", p.period?.end ?? "")))
            .reduce((a,b) => a.concat(b), [])
          )
      ) ?? [],
      validity: this.deserializeTemplateValidity(containedConsent.provision?.period?.start ?? "",
        containedConsent.provision?.period?.end ?? ""),
      organization: containedConsent.organization != undefined && containedConsent?.organization.length > 0 ?
        containedConsent?.organization[0]?.display : "",
      policy: ConsentTemplate.createEmpty().policy,
      // if true is "opt in" otherwise "opt-out"
      consentModel: containedConsent.provision?.type == "deny",
      isMiiFhirConsentConform: containedConsent.meta?.profile?.some(p => p == "https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-einwilligung")
    }
  }

  deserializeTemplatePolicies(codes: fhir4.CodeableConcept[], validity: Validity): PolicyView[] {
    return codes.map( c =>  c.coding ?? [])
    .filter(c => c.length > 0)
    .map( c => this.deserializeTemplatePolicy(c[0], validity));
  }

  deserializeTemplatePolicy(coding: fhir4.Coding, validity: Validity): PolicyView {
    const isInternalId = coding.system?.startsWith(ConsentService.POLICY_SET_PATH);
    const setId =  isInternalId? coding.system?.substring(ConsentService.POLICY_SET_PATH.length) ?? "" : "";
    const setExtId = isInternalId ? "" : coding.system ?? "";
    return {
      policySet: new ConsentPolicySet(setId, setExtId, ""),
      displayText: coding.display ?? "",
      code: coding.code ?? "",
      validity: validity
    }
  }

  deserializeTemplateValidity(startDate: string, endDate: string): Validity {
    const start = DateTime.fromISO(startDate)
    // include the last day
    const end = DateTime.fromISO(endDate).plus({days: 1})
    const duration = end.diff(start, ['years', 'months', 'days']).toObject()
    return new Validity(duration.days ?? 0, duration.months ?? 0, duration.years ?? 0);
  }

  mapValidityToDate(validityPeriod: Validity, startDate: string): string {
    return this.addPeriodToDate(startDate, validityPeriod).toISODate() ?? "";
  }

  addPeriodToDate(startDate: string, period: Validity): DateTime {
    return DateTime.fromISO(startDate)
    .plus({ days: period.days ?? 0, months: period.months ?? 0, years: period.years ?? 0 })
    .minus({day: 1});
  }

  //////////////////////////////
  ////    FHIR-Utils
  //////////////////////////////
  // TODO move to new service

  public createFhirResource<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string, resource: F) : Observable<FhirResource> {
    return this.executeFhirOperation<F>(tokenType, tokenData, resourceType, resource, this.resolveAddFhirResourceToken, "create");
  }

  public updateFhirResource<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string,
                                                    resource: F, searchParams?:SearchParams) : Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
      .pipe(
        mergeMap(token => this.resolveEditFhirResourceToken(token.id, resourceType, resource, searchParams)),
        catchError((error) => this.handleFailedRequest(resourceType, error, [ErrorMessages.CREATE_CONSENT_REJECTED], "update"))
      )
  }

  public readFhirResources<F extends FhirResource>(
    tokenType: TokenType,
    tokenData: TokenData,
    errorMessageType: ErrorMessage[],
    resourceType: string,
    id: string,
    version?: string) : Observable<F> {
    return this.executeReadFhirOperation<F>(tokenType, tokenData, errorMessageType, resourceType, id, version) as Observable<F>;
  }

  public searchFhirResources<F extends FhirResource>(tokenType: TokenType, tokenData: TokenData, resourceType: string,
                                                     errorMessageType: ErrorMessage[], searchParam?:SearchParams) : Observable<(F | undefined)[]> {
    let result : Observable<FhirResource> = this.executeSearchFhirOperation(tokenType, tokenData, resourceType,
      this.resolveSearchFhirResourceToken, "search", errorMessageType, searchParam);
    return (result as Observable<fhir4.Bundle<F>>).pipe(
      map( b => b.entry?.map(r => r.resource)||[])
    );
  }

  public executeReadFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      errorMessageTypes: ErrorMessage[],
      resourceType: string,
      id: string,
      version?: string,
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => this.resolveReadFhirResourceToken<F>(token.id, resourceType, id, version)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageTypes, "read"))
    )
  }

  public executeDeleteFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      resourceType: string,
      id: string,
      errorMessageTypes: ErrorMessage[],
      urlParams?: SearchParams
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => this.resolveDeleteFhirResourceToken<F>(token.id, resourceType, id, urlParams)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageTypes, "delete"))
    )
  }

  public executeSearchFhirOperation<F extends FhirResource>(
      tokenType: TokenType,
      tokenData: TokenData,
      resourceType: string,
      resolveToken: (tokenId: string | undefined, resourceType: string, searchParam?: SearchParams) => Promise<FhirResource | F>,
      errorPrefix: string,
      errorMessageTypes: ErrorMessage[],
      searchParam?: SearchParams
  ): Observable<FhirResource> {
    return this.sessionService.createToken(tokenType, tokenData)
    .pipe(
        mergeMap(token => resolveToken(token.id, resourceType, searchParam)),
        catchError((error) => this.handleFailedRequest(resourceType, error, errorMessageTypes, errorPrefix))
    )
  }

  private handleFailedRequest(resourceType: string, error: any, errorMessageTypes: ErrorMessage[], errorPrefix: string) {
    if (error.response?.data != undefined) {
      let errorMessage = "";
      for (const issue of (error.response.data as fhir4.OperationOutcome).issue) {
        if (issue.severity == 'error')
          errorMessage += issue.diagnostics
      }
      const errorMessageType = errorMessageTypes.find(msg => msg.matchFhirMessage(errorMessage))
      if(errorMessageType)
        return throwError( () => new MainzellisteError(errorMessageType, ...errorMessageType.findVariablesFromFhirMessage(errorMessage)));
      else // fallback
        return throwError( () => new MainzellisteError(errorMessageTypes[0], errorMessage));
    }
    return throwError( () => new MainzellisteUnknownError(`Failed to ${errorPrefix} resource fhir/${resourceType}.
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
          throwError( () => new Error(`Failed to ${errorPrefix} resource fhir/${resourceType}. Cause: ${getErrorMessageFrom(error, this.translate)}`))
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

  resolveReadFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, id: string, version?: string): Promise<FhirResource | F> => {
    return version == undefined ? this.client.read({
        resourceType: resourceType,
        id: id,
        options: {headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
      }):
      this.client.vread({
        resourceType: resourceType,
        id: id,
        version: version,
        options: {headers: {'Authorization': 'MainzellisteToken ' + tokenId}}
      })
  }

  resolveDeleteFhirResourceToken = <F extends FhirResource>(tokenId: string | undefined, resourceType: string, id:string, urlParams?: SearchParams): Promise<FhirResource | F> => {
    return this.client.delete({
      resourceType: resourceType,
      id: urlParams && Object.keys(urlParams).length > 0 ? id + "?" +  querystring.stringify(urlParams) : id,
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
            return throwError( () => new Error(`Failed to fetch data from ${path}. Cause: ${getErrorMessageFrom(error, this.translate)}`));
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

  public addPolicySet(id: String, name: String, externalId: String): Observable<any> {
    let body = JSON.stringify({ id, name, externalId });
    return this.postData<ConsentPolicySet>("addConsentPolicySet", {}, "consent-policies", body)
  }

  public addPolicy(setId: String, code: String, text: String): Observable<any> {
    let body = JSON.stringify({ code, text });
    let path = "consent-policies/" + setId + "/policy";
    return this.postData<ConsentPolicy>("addConsentPolicy", {}, path, body)
  }

  public postData<T>(tokenType: TokenType, tokenData: TokenData, path : string, body: String) {
    console.log(tokenData, tokenType, path, body);
    return this.sessionService.createToken(tokenType, tokenData)
      .pipe(
        mergeMap(token => this.resolvePostToken<T>(token.id, path, body)),
        catchError((error) => {
          if (error.status >= 400 && error.status < 500) {
            return throwError(() => error);
          } else {
            return throwError( () => new Error(`Failed to fetch data from ${path}. Cause: ${getErrorMessageFrom(error, this.translate)}`));
          }
        })
      )
  }

  public resolvePostToken<T>(tokenId: string | undefined, path: string, body: String) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2')
      .set('Authorization', 'MainzellisteToken ' + tokenId);

      return this.httpClient.post<T>(this.mainzellisteBaseUrl + "/" + path, body, { headers });
  }

  //////////////////////////////
  ////    Consent-Scans
  //////////////////////////////

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
        if (e instanceof HttpErrorResponse && (e.status == 403)) {
          const errorMessage = this.uploadConsentScanErrorMessages.find(msg => msg.match(e))
          // find error message arguments
          if( errorMessage == ErrorMessages.FAILED_UPLOAD_CONSENT_SCAN_FILE) {
            return throwError( () => new MainzellisteError(errorMessage, ...errorMessage.findVariables(e)));
          } else {
            throwError( () => errorMessage != undefined ? new MainzellisteError(errorMessage) : e);
          }
        }
        return throwError( () => e);
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
      recorded: DateTime.now().toISO(),
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
      'Provenance', [ErrorMessages.SEARCH_CONSENT_PROVENANCE_FAILED],
      {
        'target': this.appConfigService.getMainzellisteUrl() + '/Consent/' + versionedConsentId
      });
  }

  getConsentScan(consentScanId:string, version? :string){
    return this.readFhirResources<fhir4.DocumentReference>("readConsentScan", {},
      [ErrorMessages.READ_CONSENT_SCAN_FAILED], 'DocumentReference', consentScanId, version);
  }
}
