import { Component, Input, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PatientListService } from "../services/patient-list.service";
import { Patient } from "../model/patient";
import { GlobalTitleService } from "../services/global-title.service";
import { Id } from "../model/id";
import { MatTable } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { PatientService } from "../services/patient.service";
import { DeletePatientDialog } from "./dialogs/delete-patient-dialog";
import { NewIdDialog } from './dialogs/new-id-dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConsentDialogComponent } from "../consent/consent-dialog/consent-dialog.component";
import { ConsentService } from "../consent/consent.service";
import { Permission } from "../model/permission";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { MainzellisteUnknownError } from "../model/mainzelliste-unknown-error";
import { Consent, ConsentRow, ConsentsView } from "../consent/consent.model";
import { catchError, mergeMap } from "rxjs/operators";
import { DeleteConsentDialog } from "./dialogs/delete-consent-dialog";
import { IdType } from "../model/id-type";
import { AuthorizationService } from "../services/authorization.service";
import { MainzellisteError } from "../model/mainzelliste-error.model";
import { ErrorMessages } from "../error/error-messages";
import { ConsentRejectedDialog } from "../consent/dialogs/consent-rejected-dialog";
import { ConsentInactivatedDialog } from "../consent/dialogs/consent-inactivated-dialog";
import { SecondaryIDCardDialog } from './dialogs/secondary-idcard-dialog';
import { IdGenerator } from "../model/idgenerator";
import { AppConfigService } from "../app-config.service";
import {
  ConsentHistoryDialogComponent
} from "../consent/consent-history-dialog/consent-history-dialog.component";
import { FhirResource } from "fhir-kit-client/types/index";
import { SearchParams } from "fhir-kit-client";
import { SemanticType, Field } from '../model/field';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {
  @Input() public inIdType: string ="";
  @Input() public inIdString: string ="";

  //Pageinator
  public pageIndex= 1;
  public pageSize = 5;

  getFilteredFileds(arg0: { [key: string]: string; }): { [key: string]: any; } {
    throw new Error('Method not implemented.');
  }
  public readonly Permission = Permission;

  public idString: string = "";
  public idType: string = "";
  public patient: Patient = new Patient();
  public displayedConsentColumns: string[] = ['date', 'title', 'period', 'version', 'status', 'actions'];
  public consentsView: ConsentsView = { consentTemplates: new Map, consentRows: [] };
  @ViewChild('consentTable') consentTable!: MatTable<ConsentRow>;
  public loadingConsents: boolean = false;
  public idTypes: IdType[] = [];
  private readIdTypes: string[] = [];
  private otherTenantIdTypes: string[] = [];
  fields: Field[];
  public secondaryIdentities: Patient[] = [new Patient({ "Nachname": "Fischer", "Vorname": "Peter", "Geburtsname": "", "Geburtsdatum": "23.05.1985", "Wohnort": "Hamburg", "PLZ": "20095" },
    [{
      idType: "biobankId", idString: "9101",
      tentative: true
    }]),
    new Patient({ "Nachname": "Schmidt", "Vorname": "Anna", "Geburtsname": "Meier", "Geburtsdatum": "12.11.1990", "Wohnort": "Berlin", "PLZ": "10115" },
      [{
        idType: "biobankId", idString: "5678",
        tentative: true
      }]),
    new Patient({ "Nachname": "Müller", "Vorname": "Hans", "Geburtsname": "", "Geburtsdatum": "01.01.1970", "Wohnort": "München", "PLZ": "80331" },
      [{
        idType: "biobankId", idString: "1234",
        tentative: true
      }]),
    new Patient({ "Nachname": "Klein", "Vorname": "Klaus", "Geburtsname": "", "Geburtsdatum": "15.07.1980", "Wohnort": "Frankfurt", "PLZ": "60311" },
      [{
        idType: "biobankId", idString: "4321",
        tentative: true
      }]),
    new Patient({ "Nachname": "Schneider", "Vorname": "Maria", "Geburtsname": "", "Geburtsdatum": "30.04.1995", "Wohnort": "Düsseldorf", "PLZ": "40213" },
      [{
        idType: "biobankId", idString: "6789",
        tentative: true
      }]),
    new Patient({ "Nachname": "Weber", "Vorname": "Thomas", "Geburtsname": "", "Geburtsdatum": "25.09.1988", "Wohnort": "Stuttgart", "PLZ": "70173" },
      [{
        idType: "biobankId", idString: "3456",
        tentative: true
      }]),
    new Patient({ "Nachname": "Becker", "Vorname": "Sabine", "Geburtsname": "", "Geburtsdatum": "07.03.1975", "Wohnort": "Köln", "PLZ": "50667" },
      [{
        idType: "biobankId", idString: "7890",
        tentative: true
      }]),
    new Patient({ "Nachname": "Hoffmann", "Vorname": "Andreas", "Geburtsname": "", "Geburtsdatum": "18.06.1983", "Wohnort": "Hannover", "PLZ": "30159" },
      [{
        idType: "biobankId", idString: "9012",
        tentative: true
      }]),
    new Patient({ "Nachname": "Schulz", "Vorname": "Petra", "Geburtsname": "", "Geburtsdatum": "02.12.1992", "Wohnort": "Leipzig", "PLZ": "04109" },
      [{
        idType: "biobankId", idString: "3456",
        tentative: true
      }]),
    ];


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
    public secondaryIDCardDialog: MatDialog,
    public consentService: ConsentService,
    public configService: AppConfigService
  ) {
    if(this.activatedRoute != null){
    this.activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    });
  }else{
    this.idType = this.inIdType;
    this.idString = this.inIdString;
  }
    this.changeTitle();
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
    this.fields = this.fields.filter(f => f.name !== "Geburtsname" && f.name !== "Wohnort" && f.name !== "PLZ");
  }

  ngOnInit() {
    // find id types, that can be created
    this.getIdTypes();

    // find id types, that can be read
    this.readIdTypes = this.patientListService.getAllIdTypes("R")
    this.otherTenantIdTypes = this.authorizationService.getTenants()
      .filter(t => t.id != this.authorizationService.currentTenantId)
      .map(t => t.idTypes)
      .reduce((a, b) => a.concat(b));
    this.readIdTypes.push(... this.otherTenantIdTypes)

    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    //load consent list
    if (this.consentService.isServiceEnabled() && this.authorizationService.hasPermission(Permission.READ_CONSENT))
      this.loadConsents();
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
          return throwError(() => new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
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
        dataModel.consent.patientId = { idType: this.idType, idString: this.idString };
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
          dataModel.consent.patientId = { idType: this.idType, idString: this.idString };
          this.updateConsent(dataModel.consent, false, processDone);
        }
      });
    })
  }

  updateConsent(dataModel: Consent, force: boolean, processDone: EventEmitter<boolean>, searchParams?: SearchParams) {
    this.consentService.updateConsent(dataModel, force || false, searchParams).pipe(
      mergeMap(c =>
        this.consentService.createScansAndProvenance(dataModel, (c as fhir4.Consent).id ?? "")
      ),
      catchError(e => throwError(() => e))
    ).subscribe({
      next: () => { },
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

  openViewConsentHistoryDialog(consentId: string, version: number) {
    this.consentHistoryDialog.open(ConsentHistoryDialogComponent, {
      width: '900px',
      disableClose: true,
      data: {
        consentId: consentId,
        consentVersion: version
      }
    });
  }

  getIdTypes(): IdType[] {
    if (this.idTypes.length == 0) {
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
    let idGenerators: IdGenerator[] = this.configService.getMainzellisteIdGenerators();
    let associatedIdGenerators: IdGenerator[] = this.configService.getMainzellisteAssociatedIdGenerators();
    return this.getIdTypes()
      .filter(t => t.isAssociated && associatedIdGenerators.some(g => g.isPersistent && g.idType == t.name) ||
        idGenerators.some(g => g.isPersistent && g.idType == t.name) &&
        !patient.ids.some(id => id.idType == t.name));
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
    const dialogRef = this.deletePatientDialog.open(DeletePatientDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deletePatient();
    });
  }


  openDeleteConsentDialog(consentId: string): void {
    const dialogRef = this.deleteConsentDialog.open(DeleteConsentDialog, {
      data: {},
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

  showDomainsCard(): boolean {
    return this.configService.showDomainsInIDCard() && this.authorizationService.getTenants().length > 1;
  }

  getFilteredFields(fields: {[key: string]: string;}): {[key: string]: string;}{
    return Object.keys(fields)
      .filter(key => key !== 'Geburtsname' && key !== 'Wohnort' && key !== 'PLZ')
      .reduce((obj: { [key: string]: string }, key) => {
      obj[key] = fields[key];
      return obj;
      }, {});

  }

  showSecondartyIDCardDialog(patient: Patient) {
    const dialogRef = this.secondaryIDCardDialog.open(SecondaryIDCardDialog, {
      data: {idString: patient.getIdString(this.idType), idType: this.idType},
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  
}
