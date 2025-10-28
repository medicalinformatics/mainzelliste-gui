import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";
import {Id} from "../model/id";
import {MatTable} from "@angular/material/table";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PatientService} from "../services/patient.service";
import {NewIdDialog} from './dialogs/new-id-dialog';
import {TranslateService} from '@ngx-translate/core';
import {ConsentDialogComponent} from "../consent/consent-dialog/consent-dialog.component";
import {ConsentService} from "../consent/consent.service";
import {Permission} from "../model/permission";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {Consent, ConsentRow, ConsentsView} from "../consent/consent.model";
import {catchError, map, mergeMap} from "rxjs/operators";
import {IdType} from "../model/id-type";
import {AuthorizationService} from "../services/authorization.service";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessages} from "../error/error-messages";
import {ConsentRejectedDialog} from "../consent/dialogs/consent-rejected-dialog";
import {ConsentInactivatedDialog} from "../consent/dialogs/consent-inactivated-dialog";
import {IdGenerator} from "../model/idgenerator";
import {AppConfigService} from "../app-config.service";
import {
  ConsentHistoryDialogComponent
} from "../consent/consent-history-dialog/consent-history-dialog.component";
import {FhirResource} from "fhir-kit-client/types/index";
import {SearchParams} from "fhir-kit-client";
import {SemanticType} from '../model/field';
import {AngularCsv} from 'angular-csv-ext/dist/Angular-csv';
import {
  ConfirmDeleteDialogComponent
} from "../shared/components/confirm-delete-dialog/confirm-delete-dialog.component";
import {Tenant} from "../model/tenant";
import {ComponentType} from "@angular/cdk/portal";


@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {
  public readonly Permission = Permission;

  public idString: string = "";
  public idType: string = "";
  public patient: Patient = new Patient();
  public relatedAssociatedIdMap: Map<Id, Id[]> = new Map<Id, Id[]>();
  public displayedConsentColumns: string[] = ['date', 'title', 'period', 'version', 'status', 'actions'];
  public consentsView: ConsentsView = { consentTemplates: new Map, consentRows: [] };
  @ViewChild('consentTable') consentTable!: MatTable<ConsentRow>;
  public loadingConsents: boolean = false;
  public idTypes: IdType[] = [];
  private readIdTypes: string [] = [];
  private otherTenantIdTypes: string [] = [];

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private patientService: PatientService,
    private titleService: GlobalTitleService,
    private authorizationService: AuthorizationService,
    public consentDialog: MatDialog,
    public consentHistoryDialog: MatDialog,
    public deletePatientDialog: MatDialog,
    public deleteConsentDialog: MatDialog,
    public consentRejectedDialog: MatDialog,
    public consentInactivatedDialog: MatDialog,
    public newIdDialog: MatDialog,
    public consentService: ConsentService,
    public configService: AppConfigService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    });
    this.changeTitle();
  }

  ngOnInit() {
    // find id types, that can be created
    this.getIdTypes();

    // find id types, that can be read
    let readIdTypesSet = new Set(this.patientListService.getAllIdTypes("R"));
    if(this.configService.showDomainsInIDCard() && this.authorizationService.currentTenantId != Tenant.DEFAULT_ID) {
      this.otherTenantIdTypes = this.authorizationService.getAllTenantIdTypes(true);
      this.authorizationService.getAllTenantIdTypes().forEach( t => this.otherTenantIdTypes.push(t));
    }
    this.readIdTypes = [... readIdTypesSet];

    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    //load consent list
    if (this.authorizationService.hasPermission(Permission.READ_CONSENT))
      this.loadConsents();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('idcard.title_id_card'), false, "badge");
  }

  private loadPatient() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R", undefined, this.readIdTypes)
    .pipe(
      map(patients => this.patientListService.convertToDisplayPatient(patients[0], false, true, this.authorizationService.getTenants())),
      mergeMap(patient => this.loadRelatedAssociatedIds(patient, this.getIdTypes().filter( t => t.isAssociated ))),
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      })
    )
    .subscribe(
      result => {
        this.patient = result.patient;
        this.patient.ids = this.patient.ids.filter(id => !this.otherTenantIdTypes.some(t => t == id.idType));
        this.relatedAssociatedIdMap = result.relatedAssociatedIdMap;
      });
  }

  private loadRelatedAssociatedIds(patient: Patient, associatedIdTypes: IdType[]): Observable<{
    patient: Patient,
    relatedAssociatedIdMap: Map<Id, Id[]>
  }> {
    let searchIds = patient.ids.filter(id => associatedIdTypes.some(t => t.name == id.idType))
    return searchIds.length > 0 ? this.patientListService.readPatients(
      searchIds,
      "R",
      undefined,
      associatedIdTypes.map(t => t.name))
    .pipe(
      map(patients => {
        let relatedAssociatedIdMap = new Map<Id, Id[]>()
        searchIds.forEach((id, i) => relatedAssociatedIdMap.set(id, patients[i].ids));
        return {
          patient: patient,
          relatedAssociatedIdMap: relatedAssociatedIdMap
        };
      })
    ): of({
      patient: patient,
      relatedAssociatedIdMap: new Map<Id, Id[]>()
    })
  }

  private loadConsents() {
    this.loadingConsents = true;
    this.consentsView = { consentTemplates: new Map, consentRows: [] }
    this.consentService.getConsents(this.idType, this.idString)
    .subscribe({
      next: (dataModels) => {
        this.consentsView = dataModels;
        this.consentTable.renderRows();
        this.loadingConsents = false;
      },
      error: (error) => this.loadingConsents = false
    });
  }

  generateId(idType: string, idString: string, newIdType: string) {
    this.patientListService.generateId(idType?.length > 0 ? idType : this.idType,
      idString?.length > 0 ? idString : this.idString, newIdType).subscribe(() => {
        this.loadPatient()
      });
  }

  generateNewId(idType: string, idString: string, newIdType: string, newIdValue: string) {
    return this.patientListService.generateId(idType?.length > 0 ? idType : this.idType,
      idString?.length > 0 ? idString : this.idString, newIdType, newIdValue);
  }

  hasAllTemplateIds(): boolean {
    return [...this.consentsView.consentTemplates.keys()].every(templateId =>
      this.consentsView.consentRows.some(v => v.templateId == templateId))
  }

  openAddNewConsentDialog() {
    const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
      width: '900px',
      disableClose: true,
      data: {
        templates: new Map([...this.consentsView.consentTemplates].filter(e =>
          !this.consentsView.consentRows.some(r => r.templateId == e[0])),
        ),
        updateConsentObservable: (dataModel: Consent) => this.getUpdateConsentObservable(
          of(dataModel).pipe(
            map(consent => {
              consent.patientId = {idType: this.idType, idString: this.idString};
              if (consent.fhirResource) {
                consent.fhirResource.patient = {
                  identifier: this.consentService.convertToFhirIdentifier(consent.patientId)
                }
              }
              return consent;
            })),
          false,
          consent => {
            return {
              'patient:identifier': consent.fhirResource?.patient?.identifier?.system + '|' + consent?.fhirResource?.patient?.identifier?.value,
              'policyUri': 'fhir/Questionnaire/' + consent.templateId
            }
          })
      }
    });

    this.afterConsentUpdate(dialogRef);
  }

  openChangeConsentDialog(consentId: string) {
    this.consentService.readConsent(consentId).subscribe(c => {
      const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
        width: '900px',
        disableClose: true,
        data: {
          consent: c,
          readonly: false,
          edit: true,
          updateConsentObservable: (consent: Consent) => this.getUpdateConsentObservable(
            of(consent).pipe(
              map(consent => {
              consent.patientId = {idType: this.idType, idString: this.idString};
              return consent;
            })),
            false)
        }
      });

      this.afterConsentUpdate(dialogRef);
    })
  }

  getUpdateConsentObservable(observable : Observable<any>, force: boolean,
                             searchParamsProvider? : (dataModel: Consent) => SearchParams) {
    return observable.pipe(
      mergeMap(consent => this.consentService.updateConsent(consent, force || false,  searchParamsProvider ? searchParamsProvider(consent) : undefined).pipe(
        mergeMap(c =>
          this.consentService.createProvenance(consent, (c as fhir4.Consent).id ?? "")
        ),
        catchError(e => throwError( () => { return { error: e, dataModel: consent}}))
      ))
    )
  }

  afterConsentUpdate(dialogRef: MatDialogRef<any, any>){
    dialogRef.beforeClosed().subscribe(result => {
      if(!result)
        return
      else if(result.error){
        if (result.error instanceof MainzellisteError && result.error.errorMessage == ErrorMessages.CREATE_CONSENT_REJECTED) {
          this.openConsentConfirmationDialog(result.dataModel, this.consentRejectedDialog, ConsentRejectedDialog);
        } else if (result.error instanceof MainzellisteError && result.error.errorMessage == ErrorMessages.CREATE_CONSENT_INACTIVE) {
          this.openConsentConfirmationDialog(result.dataModel, this.consentInactivatedDialog, ConsentInactivatedDialog);
        }
      } else {
        this.loadConsents()
      }
    });
  }

  private openConsentConfirmationDialog<T>(dataModel: Consent, consentConfirmationDialog: MatDialog, component: ComponentType<T>) {
    consentConfirmationDialog.open(component, {
      data: {
        updateConsentObservable: this.getUpdateConsentObservable(of(dataModel), true)
      }})
    .beforeClosed().subscribe({
      next: () => {},
      error: e => {},
      complete: () => {
        this.loadConsents();
      }
    });
  }

  openViewConsentDialog(consentId: string) {
    this.consentService.readConsent(consentId).subscribe(
      c => this.consentDialog.open(ConsentDialogComponent, {
        width: '900px',
        disableClose: true,
        data: {
          consent: c,
          readonly: true
        }
      })
    );
  }

  openViewConsentHistoryDialog(consentId: string, version :number) {
    this.consentHistoryDialog.open(ConsentHistoryDialogComponent, {
        width: '900px',
        disableClose: true,
        data: {
          consentId: consentId,
          consentVersion: version
        }
      });
  }

  getIdTypes():IdType[] {
    if (this.idTypes.length == 0){
      this.idTypes = [
        ...this.patientListService.getUniqueIdTypes(false, "C")
          .map(t => { return { name: t, isExternal: false, isAssociated: false } }),
        ...this.patientListService.getUniqueIdTypes(true, "C")
          .map(t => { return { name: t, isExternal: true, isAssociated: false } }),
        ...this.patientListService.getAssociatedIdTypes(false, "C")
          .map(t => { return { name: t, isExternal: false, isAssociated: true } }),
        ...this.patientListService.getAssociatedIdTypes(true, "C")
          .map(t => { return { name: t, isExternal: true, isAssociated: true } }),
      ];
    }
    return this.idTypes;
  }

  getUnAvailableIdTypes(patient: Patient): IdType[] {
    let idGenerators : IdGenerator[] = this.configService.getMainzellisteIdGenerators();
    let associatedIdGenerators : IdGenerator[] = this.configService.getMainzellisteAssociatedIdGenerators();
    return this.getIdTypes()
    .filter( t => t.isAssociated && associatedIdGenerators.some(g => g.isPersistent && g.idType == t.name)||
      idGenerators.some(g => g.isPersistent && g.idType == t.name) &&
      !patient.ids.some( id => id.idType == t.name));
  }

  hasAllIds(): boolean {
    return this.getUnAvailableIdTypes(this.patient).length == 0;
  }

  openNewIdDialog(): void {
    this.newIdDialog.open(NewIdDialog, {
      disableClose: true,
      data: {
        patientIds: this.patient.ids,
        relatedAssociatedIdsMap: this.patientListService.getRelatedAssociatedIdsMapFrom(
          this.getUnAvailableIdTypes(this.patient), this.relatedAssociatedIdMap, "R"),
        generateIdObservable: (externalId: Id, newIdType: string, newIdValue: string) =>
          this.generateNewId(externalId?.idType ?? "", externalId?.idString ?? "", newIdType, newIdValue)
      }
    }).beforeClosed().subscribe(result => {
      if(!result)
        return;
      this.loadPatient();
    })
  }

  openDeletePatientDialog(): void {
    this.deletePatientDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_patient",
        callbackObservable: this.patientService.deletePatient(this.patient)
      },
    })
    .afterClosed().subscribe(result => {
      if (result)
        this.router.navigate(['/patientlist']).then();
    });
  }


  openDeleteConsentDialog(consentId: string): void {
    this.deleteConsentDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent",
        callbackObservable: this.consentService.deleteConsent(consentId)
      },
    })
    .afterClosed().subscribe(result => {
      if (result) {
        this.loadConsents();
      }
    });
  }

  getContactInfo() {
    const fieldMap = this.getFieldMap();
    return `${fieldMap[SemanticType.FIRSTNAME]} ${fieldMap[SemanticType.LASTNAME]}\n${fieldMap[SemanticType.POSTAL_CODE]} ${fieldMap[SemanticType.CITY]}`;
  }

  exportCSV() {
    const fieldMap = this.getFieldMap();
    var data = [
      {
        firstName: fieldMap[SemanticType.FIRSTNAME],
        lastName: fieldMap[SemanticType.LASTNAME],
        residence: fieldMap[SemanticType.CITY],
        plz: fieldMap[SemanticType.POSTAL_CODE]
      }
    ]

    new AngularCsv(data, 'ContactInfo', {
      headers: [this.translate.instant("first_name_text"),
         this.translate.instant("last_name_text"),
         this.translate.instant("zip_code_text"),
         this.translate.instant("residence_text")],
      quoteStrings: '',
      delimiter: ';'
    },);
  }

  getFieldMap() {
    const contact = this.patient.fields;
    const fieldMap: { [key: string]: string } = {
      [SemanticType.FIRSTNAME]: "",
      [SemanticType.LASTNAME]: "",
      [SemanticType.POSTAL_CODE]: "",
      [SemanticType.CITY]: ""
    };

    this.patientService.getConfiguredFields("R").forEach(fieldConfig => {
      if (fieldMap.hasOwnProperty(fieldConfig.semantic)) {
        fieldMap[fieldConfig.semantic] = contact[fieldConfig.name];
      }
    });
    return fieldMap;
  }

  showDomainsCard():boolean{
    return this.configService.showDomainsInIDCard() && this.authorizationService.getTenants().length > 1;
  }
}
