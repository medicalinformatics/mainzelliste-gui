import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";
import {Id} from "../model/id";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {PatientService} from "../services/patient.service";
import {NewIdDialog} from './dialogs/new-id-dialog';
import {TranslateService} from '@ngx-translate/core';
import {ConsentDialogComponent} from "../consent/consent-dialog/consent-dialog.component";
import {ConsentService} from "../consent/consent.service";
import {Permission} from "../model/permission";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {Consent, ConsentRow, ConsentsView} from "../consent/consent.model";
import {catchError, mergeMap} from "rxjs/operators";
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
import {SearchParams} from "fhir-kit-client";
import {AngularCsv} from 'angular-csv-ext/dist/Angular-csv';
import {
  ConfirmDeleteDialogComponent
} from "../shared/components/confirm-delete-dialog/confirm-delete-dialog.component";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { SemanticType, Field } from '../model/field';
import { LocalStorageService } from "../services/local-storage.service";
import { PageEvent } from '@angular/material/paginator';
import { PatientList } from '../model/patientlist';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {
  private patientList: PatientList;

  public height: string = 'auto';

  configuredIdTypes: string[] = [];
  public defaultIdType: string = "";
  columns: string[] = [];
  allColumnNames: string[] = [];
  showAllIds: boolean;
  fieldNames: string[];
  displayedColumns: string[] = [];
  clickedRow: any;


  //Pageinator
  public pageIndex = 0;
  public pageSize = 5;
  fields: Field[];

  public secondaryIdentities: Patient[] = [
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Schmidt", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20095", "Date_Added": "01.01.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Maximilian", "Geburtsname": "Meier", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20095", "Date_Added": "02.01.2021" },
      [{ idType: "biobankId", idString: "5678", tentative: true }]),
    new Patient({ "Nachname": "Mustermann", "Vorname": "Max", "Geburtsname": "Schneider", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20095", "Date_Added": "03.01.2021" },
      [{ idType: "biobankId", idString: "1234", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Schmidt", "Geburtdatum": "02.01.1980", "Wohnort": "Berlin", "PLZ": "10115", "Date_Added": "04.01.2021" },
      [{ idType: "biobankId", idString: "4321", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Maxim", "Geburtsname": "Fischer", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10116", "Date_Added": "05.01.2021" },
      [{ idType: "biobankId", idString: "6789", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Weber", "Geburtdatum": "03.01.1980", "Wohnort": "Stuttgart", "PLZ": "70173", "Date_Added": "06.01.2021" },
      [{ idType: "biobankId", idString: "3456", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Schmidt", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20095", "Date_Added": "07.01.2021" },
      [{ idType: "biobankId", idString: "7890", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Schneider", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20096", "Date_Added": "08.01.2021" },
      [{ idType: "biobankId", idString: "9012", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "Müller", "Geburtdatum": "04.01.1980", "Wohnort": "Leipzig", "PLZ": "04109", "Date_Added": "09.01.2021" },
      [{ idType: "biobankId", idString: "3456", tentative: true }]),
  ];
  public history: Patient[] = [
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "", "Geburtdatum": "01.01.1980", "Wohnort": "Hamburg", "PLZ": "20095", "Date_Added": "01.01.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Max", "Geburtsname": "", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10115", "Date_Added": "01.03.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Muster", "Vorname": "Maximilian", "Geburtsname": "", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10115", "Date_Added": "01.06.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmitt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10115", "Date_Added": "01.09.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10115", "Date_Added": "01.12.2021" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Berlin", "PLZ": "10117", "Date_Added": "01.03.2022" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Munich", "PLZ": "80331", "Date_Added": "01.06.2022" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Munich", "PLZ": "80333", "Date_Added": "01.09.2022" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Munich", "PLZ": "80335", "Date_Added": "01.12.2022" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Maximilian", "Geburtsname": "Muster", "Geburtdatum": "01.01.1980", "Wohnort": "Munich", "PLZ": "80337", "Date_Added": "01.03.2023" },
      [{ idType: "biobankId", idString: "9101", tentative: true }]),
  ];

  public readonly Permission = Permission;

  public idString: string = "";
  public idType: string = "";
  public patient: Patient = new Patient();
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
    public configService: AppConfigService,
    private httpClient: HttpClient,
    private sessionService: SessionService
  ) {
    this.patientList = this.configService.data[0];
    this.activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    });
    this.changeTitle();
    
    this.history.sort((a, b) => {
      const dateA = new Date(a.fields.Date_Added);
      const dateB = new Date(b.fields.Date_Added);
      return dateA.getTime() - dateB.getTime();
    });

    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
  }

  ngOnInit() {
    // find id types, that can be created
    this.getIdTypes();

    // find id types, that can be read
    this.readIdTypes = this.patientListService.getAllIdTypes("R")
    this.otherTenantIdTypes = this.authorizationService.getTenants()
    .filter(t => t.id != this.authorizationService.currentTenantId)
    .map(t => t.idTypes)
    .reduce((a,b) => a.concat(b));
    this.readIdTypes.push(... this.otherTenantIdTypes)

    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    //load consent list
    if (this.consentService.isServiceEnabled() && this.authorizationService.hasPermission(Permission.READ_CONSENT))
      this.loadConsents();

    this.configuredIdTypes = this.patientListService.getIdTypes("R");
    this.defaultIdType = this.patientListService.findDefaultIdType(this.configuredIdTypes);

    this.displayedColumns = [...this.configuredIdTypes, ...this.fields.map(field => field.name)];
   
    this.height = 40 + (this.fields.length * 30) + 'px';

    this.getSecondaryIdentities().subscribe({
      next: (response) => {
        console.log(response);
        // this.secondaryIdentities= response;
      },
      error: (error) => {
        this.secondaryIdentities = [];
        throw error;
      }
    })
  }
  getSecondaryIdentities() {
    console.log('getSecondaryIdentities called');
    return this.sessionService.createToken("readIdentities", {}).pipe(
      mergeMap(token => {
        console.log('Token received:', token);
        return this.readSecondaryIdentities(token.id);
      }),
      catchError((error) => {
        console.error('Error occurred in getSecondaryIdentities:', error);
        if (error.status >= 400 && error.status < 500) {
          return throwError(() => new Error("failed to fetch identities"));
        } else {
          return throwError(() => new Error("failed to fetch identities"));
        }
      })
    );
  }

  readSecondaryIdentities(tokenId: string | undefined) {
    const body = { "idType": this.idType, "idString": this.idString };
    const params = new HttpParams().set('tokenId', tokenId ?? '');

    console.log('readSecondaryIdentities called with tokenId:', tokenId);
    console.log('Request body:', body);
    console.log('Request params:', params.toString());

    return this.httpClient.post<Patient[]>(this.patientList.url + "/identities", body, {
      params: params,
      observe: 'response'
    }).pipe(
      mergeMap(response => {
        console.log('Response:', response);
        if (response.body) {
          console.log('Response body:', response.body);
          return response.body;
        } else {
          console.error('Failed to fetch tentatives');
          return throwError(() => new Error("failed to fetch tentatives"));
        }
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error("failed to fetch tentatives"));
      })
    );
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('idcard.title_id_card'), false, "badge");
  }

  private loadPatient() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R", undefined, this.readIdTypes)
    .pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError( () => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      })
    )
    .subscribe(
      patients => {
        this.patient = this.patientListService.convertToDisplayPatient(patients[0], false, this.authorizationService.getTenants());
        this.patient.ids = this.patient.ids.filter(id => !this.otherTenantIdTypes.some(t => t == id.idType));
      });
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

  deleteConsent(consentId: string) {
    this.consentService.deleteConsent(consentId).pipe(
        mergeMap(r => this.consentService.getConsents(this.idType, this.idString))
    ).subscribe({
      next: dataModels => {
        this.consentsView = dataModels;
        this.consentTable.renderRows();
        this.loadingConsents = false;
      },
      error: () => this.loadingConsents = false
    });
  }

  deletePatient() {
    this.patientService.deletePatient(this.patient).then(() => this.router.navigate(['/patientlist']).then());
  }

  generateId(idType: string, idString: string, newIdType: string) {
    this.patientListService.generateId(idType?.length > 0 ? idType : this.idType,
      idString?.length > 0 ? idString : this.idString, newIdType).subscribe(() => {
        this.loadPatient()
      });
  }

  hasAllTemplateIds(): boolean {
    return [...this.consentsView.consentTemplates.keys()].every(templateId =>
      this.consentsView.consentRows.some(v => v.templateId == templateId))
  }

  openAddNewConsentDialog() {
    let processDone = new EventEmitter<boolean>();
    const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
      width: '900px',
      disableClose: true,
      data: {
        templates: new Map([...this.consentsView.consentTemplates].filter(e =>
          !this.consentsView.consentRows.some(r => r.templateId == e[0])),
        ),
        processDone: processDone
      }
    });

    dialogRef.beforeClosed().subscribe(dataModel => {
      if (dataModel?.consent) {
        dataModel.consent.patientId = {idType: this.idType, idString: this.idString};
        dataModel.consent.fhirResource.patient = {
          identifier: this.consentService.convertToFhirIdentifier(dataModel.consent.patientId)
        }
        this.updateConsent(dataModel.consent, false, processDone,
          {
          'patient:identifier': dataModel.consent.fhirResource.patient.identifier?.system + '|' + dataModel.consent.fhirResource.patient.identifier?.value,
          'policyUri': 'fhir/Questionnaire/' + dataModel.consent.templateId
          });
      }
    });
  }

  openChangeConsentDialog(consentId: string) {
    let processDone = new EventEmitter<boolean>();
    this.consentService.readConsent(consentId).subscribe(c => {
      const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
        width: '900px',
        disableClose: true,
        data: {
          consent: c,
          edit: true,
          processDone: processDone
        }
      });

      dialogRef.beforeClosed().subscribe(dataModel => {
        if (dataModel?.consent) {
          dataModel.consent.patientId = {idType: this.idType, idString: this.idString};
          this.updateConsent(dataModel.consent, false, processDone);
        }
      });
    })
  }

  updateConsent(dataModel: Consent, force: boolean, processDone: EventEmitter<boolean>, searchParams? :SearchParams) {
    this.consentService.updateConsent(dataModel, force || false, searchParams).pipe(
      mergeMap(c =>
        this.consentService.createScansAndProvenance(dataModel, (c as fhir4.Consent).id ?? "")
      ),
      catchError(e => throwError( () => e))
    ).subscribe({
      next: () => {},
      error: e => {
        processDone.emit(false);
        if (e instanceof MainzellisteError && e.errorMessage == ErrorMessages.CREATE_CONSENT_REJECTED) {
          this.openConsentRejectedDialog(dataModel, processDone);
        } else if (e instanceof MainzellisteError && e.errorMessage == ErrorMessages.CREATE_CONSENT_INACTIVE) {
          this.openConsentInactivatedDialog(dataModel, processDone);
        }
      },
      complete: () => {
        processDone.emit(true)
        this.loadConsents()
      }
    });
  }

  private openConsentRejectedDialog(dataModel: Consent, processDone: EventEmitter<boolean>) {
    const dialogRef = this.consentRejectedDialog.open(ConsentRejectedDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.updateConsent(dataModel, true, processDone);
    });
  }

  private openConsentInactivatedDialog(dataModel: Consent, processDone: EventEmitter<boolean>) {
    const dialogRef = this.consentInactivatedDialog.open(ConsentInactivatedDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.updateConsent(dataModel, true, processDone);
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
        ...this.patientListService.getAssociatedIdTypes(false, "C")
          .map(t => { return { name: t, isExternal: false, isAssociated: true } })
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
    const dialogRef = this.newIdDialog.open(NewIdDialog, {
      data: this.patientListService.getRelatedAssociatedIdsMapFrom(this.getUnAvailableIdTypes(this.patient), this.patient.ids, true, "R")
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.generateId(result.externalId?.idType ?? "", result.externalId?.idString ?? "", result.resultIdType);
      }
    })
  }

  openDeletePatientDialog(): void {
    const dialogRef = this.deletePatientDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_patient"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deletePatient();
    });
  }


  openDeleteConsentDialog(consentId: string): void {
    const dialogRef = this.deleteConsentDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deleteConsent(consentId);
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
    console.log(data);

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
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onRowClick(row: any) {
    this.clickedRow = row;
  }

  isDifferent(element: any, field: string): boolean {
    if (!this.clickedRow) return false;
    return element.fields[field] !== this.clickedRow.fields[field];
  }

  isClickedRow(row: any): boolean {
    return this.clickedRow === row;
  }

  isFieldChanged(identity: Patient, index: number, fieldName: string): boolean {
    if (index === 0) {
      return false; // No previous identity to compare with for the first entry
    }
    const previousIdentity = this.history[index - 1];
    return identity.fields[fieldName] !== previousIdentity.fields[fieldName];
  }
}
