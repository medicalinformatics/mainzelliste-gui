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
      catchError((error) => this.handleFailedFhirRequest("Consent", error, [ErrorMessages.READ_CONSENT_FAILED], "read"))
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
        end: this.mapValidityToDate((!p.validity || p.validity.isEmpty())? validity : p.validity, starDate)
      },
      code: !p ? [] : [
        {
          coding: [
            {
              code: p.code,
              system: p.policySet?.isExternal ? p.policySet?.id : `${ConsentService.POLICY_SET_PATH}${p.policySet?.id}`,
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
    const setId =  (isInternalId? coding.system?.substring(ConsentService.POLICY_SET_PATH.length) : coding.system) ?? "";
    return {
      policySet: new ConsentPolicySet(setId, "", !isInternalId),
      displayText: coding.display ?? "",
      code: coding.code ?? "",
      validity: validity
    }
  }

  deserializeTemplateValidity(startDate: string, endDate: string): Validity {
    const start = DateTime.fromISO(startDate);
    // include the last day
    const end = DateTime.fromISO(endDate).plus({days: 1});
    const duration = end.diff(start, ['years', 'months', 'days']).toObject();
    const durationDays = end.diff(start, ['days']);
    return new Validity(duration.days ?? 0, duration.months ?? 0, duration.years ?? 0, durationDays);
  }

  mapValidityToDate(validityPeriod: Validity, startDate: string): string {
    return this.addPeriodToDate(startDate, validityPeriod).toISODate() ?? "";
  }

  addPeriodToDate(startDate: string, period: Validity): DateTime {
    return DateTime.fromISO(startDate)
    .plus(period.duration ? period.duration : { days: period.days ?? 0, months: period.months ?? 0, years: period.years ?? 0 })
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
        catchError((error) => this.handleFailedFhirRequest(resourceType, error, [ErrorMessages.CREATE_CONSENT_REJECTED], "update"))
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
        catchError((error) => this.handleFailedFhirRequest(resourceType, error, errorMessageTypes, "read"))
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
        catchError((error) => this.handleFailedFhirRequest(resourceType, error, errorMessageTypes, "delete"))
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
        catchError((error) => this.handleFailedFhirRequest(resourceType, error, errorMessageTypes, errorPrefix))
    )
  }

  private handleFailedFhirRequest(resourceType: string, error: any, errorMessageTypes: ErrorMessage[], errorPrefix: string) {
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

  public addPolicySet(id: string, name: string): Observable<any> {
    let body = JSON.stringify({ id, name });
    return this.postData<ConsentPolicySet>("addConsentPolicySet", {}, "consent-policies", body,
      [ErrorMessages.CREATE_POLICY_SET_CONFLICT], "policy-set")
  }

  deletePolicy(policyCode: string, policySetId: string): Observable<any>  {
    return this.sessionService.createToken(
      "deleteConsentPolicy",{}
    )
    .pipe(
      mergeMap(token => this.resolveDeletePolicyToken(token.id, policyCode, policySetId))
    );
  }

  resolveDeletePolicyToken(tokenId: string | undefined, policyCode: string, policySetId: string): Observable<any> {
    return this.httpClient.delete(this.mainzellisteBaseUrl + "/consent-policies/" + policySetId + "/policy/" + policyCode, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2')
      .set('Authorization', 'MainzellisteToken ' + tokenId)
    })
    .pipe(
      catchError(e => this.handleFailedRequest("delete", e,
        [ErrorMessages.DELETE_POLICY_REJECTED], "policy")
      )
    );
  }

  deletePolicySet(id: string): Observable<any>  {
    return this.sessionService.createToken(
      "deleteConsentPolicySet",{}
    )
    .pipe(
      mergeMap(token => this.resolveDeletePolicySetToken(token.id, id))
    );
  }

  resolveDeletePolicySetToken(tokenId: string | undefined, id: string): Observable<any> {
    return this.httpClient.delete(this.mainzellisteBaseUrl + "/consent-policies/" + id, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('mainzellisteApiVersion', '3.2')
      .set('Authorization', 'MainzellisteToken ' + tokenId)
    })
    .pipe(
      catchError(e => this.handleFailedRequest("delete", e,
        [ErrorMessages.DELETE_POLICY_SET_REJECTED], "policy set")
      )
    );
  }

  public addPolicy(setId: string, code: string, text: string): Observable<any> {
    let body = JSON.stringify({ code, text });
    let path = "consent-policies/" + setId + "/policy";
    return this.postData<ConsentPolicy>("addConsentPolicy", {}, path, body,
      [ErrorMessages.CREATE_POLICY_CONFLICT], "policy")
  }

  public postData<T>(tokenType: TokenType, tokenData: TokenData, path : string, body: string,
                     errorMessageTypes: ErrorMessage[], operationName: string) {
    return this.sessionService.createToken(tokenType, tokenData)
      .pipe(
        mergeMap(token => this.resolvePostToken<T>(token.id, path, body)),
        catchError(e => this.handleFailedRequest("create", e,
          errorMessageTypes, operationName)
        )
      )
  }

  public resolvePostToken<T>(tokenId: string | undefined, path: string, body: string) {
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

  addConsentProvenance(id: string | undefined, docRefIds: (string | undefined)[], patientId: {idType: string; idString: string;} | undefined) {
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
      )),
      signature: [
        {
          type:  [
            {
              system: "urn:iso-astm:E1762-95:2013",
              code: "1.2.840.10065.1.12.1.7",
              display: "Consent Signature"
            }
          ],
          when: DateTime.now().toISO(),
          who: {
            identifier: this.convertToFhirIdentifier(patientId)
          },
          data: "data:image/png;base64,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"
        }
      ]
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
        this.addConsentProvenance(consentId, docRefIds, consent?.patientId)
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

  ////
  // Utils
  /////////////////

  private handleFailedRequest(resourcePathName: string, error: any, errorMessageTypes: ErrorMessage[], operationName: string) {
    if (error instanceof HttpErrorResponse ) {
      const errorMessage = errorMessageTypes.find(msg => msg.match(error))
      if(errorMessage)
        return throwError( () => new MainzellisteError(errorMessage, ...errorMessage.findVariables(error)));
    }
    return throwError( () => new MainzellisteUnknownError(`Failed to ${operationName} resource ${resourcePathName}.
                    Cause: ${getErrorMessageFrom(error, this.translate)}`, error, this.translate))
  }
}
