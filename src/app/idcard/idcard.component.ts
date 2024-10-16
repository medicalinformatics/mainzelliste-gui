import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";
import {Id} from "../model/id";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {PatientService} from "../services/patient.service";
import {DeletePatientDialog} from "./dialogs/delete-patient-dialog";
import {NewIdDialog} from './dialogs/new-id-dialog';
import {TranslateService} from '@ngx-translate/core';
import {ConsentDialogComponent} from "../consent/consent-dialog/consent-dialog.component";
import {ConsentService} from "../consent/consent.service";
import {Permission} from "../model/permission";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {Consent, ConsentRow, ConsentsView} from "../consent/consent.model";
import {catchError, mergeMap} from "rxjs/operators";
import {DeleteConsentDialog} from "./dialogs/delete-consent-dialog";
import {IdType} from "../model/id-type";
import {AuthorizationService} from "../services/authorization.service";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessages} from "../error/error-messages";
import {ConsentRejectedDialog} from "../consent/dialogs/consent-rejected-dialog";
import {ConsentInactivatedDialog} from "../consent/dialogs/consent-inactivated-dialog";
import {IdGenerator} from "../model/idgenerator";
import {AppConfigService} from "../app-config.service";

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
  public displayedConsentColumns: string[] = ['date', 'title', 'period', 'version', 'status', 'actions'];
  public consentsView: ConsentsView =  { consentTemplates : new Map, consentRows: [] };
  @ViewChild('consentTable') consentTable!: MatTable<ConsentRow>;
  public loadingConsents: boolean = false;
  public idTypes: IdType[] = [];

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private patientService: PatientService,
    private titleService: GlobalTitleService,
    private authorizationService: AuthorizationService,
    public consentDialog: MatDialog,
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
    this.getIdTypes();
    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    //load consent list
    if(this.consentService.isServiceEnabled() && this.authorizationService.hasPermission(Permission.READ_CONSENT))
      this.loadConsents();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('idcard.title_id_card'), false, "badge");
  }

  private loadPatient() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R")
    .pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      })
    )
    .subscribe(
      patients => {
        this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
      });
  }

  private loadConsents() {
    this.loadingConsents = true;
    this.consentsView = { consentTemplates : new Map, consentRows: [] }
    this.consentService.getConsents(this.idType, this.idString)
      .subscribe(dataModels => {
          this.consentsView = dataModels;
          this.consentTable.renderRows();
          this.loadingConsents = false;
        },
        error => this.loadingConsents = false);
  }

  deleteConsent(consentId: string) {
    this.consentService.deleteConsent(consentId).pipe(
        mergeMap(r => this.consentService.getConsents(this.idType, this.idString))
    ).subscribe(
        dataModels => {
          this.consentsView = dataModels;
          this.consentTable.renderRows();
          this.loadingConsents = false;
        },
        error => this.loadingConsents = false
    );
  }

  deletePatient() {
    this.patientService.deletePatient(this.patient).then(() => this.router.navigate(['/patientlist']).then());
  }

  generateId(idType:string, idString:string, newIdType: string) {
    this.patientListService.generateId(idType?.length > 0 ? idType : this.idType,
      idString?.length> 0 ? idString : this.idString, newIdType).subscribe(() => {
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
        let consentModel: Consent = dataModel?.consent;
        consentModel.patientId = {idType: this.idType, idString: this.idString};
        this.consentService.addConsent(consentModel).pipe(
          mergeMap(c =>
            this.consentService.createScansAndProvenance(consentModel, (c as fhir4.Consent).id || "")
          )
        ).subscribe(r => {
            processDone.emit(true);
            this.loadConsents()
          },
          error => processDone.emit(false));
      }
    });
  }

  openChangeConsentDialog(consentId: string) {
    let processDone = new EventEmitter<boolean>();
    this.consentService.readConsent(consentId).subscribe( c => {
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
          this.editConsent(dataModel.consent, false, processDone);
        }
      });
    })
  }

  editConsent(dataModel: Consent, force: boolean, processDone: EventEmitter<boolean>) {
    dataModel.patientId = {idType: this.idType, idString: this.idString};
    this.consentService.editConsent(dataModel, force || false)
    .pipe(
      mergeMap(c =>
        this.consentService.createScansAndProvenance(dataModel, (c as fhir4.Consent).id || "")
      ),
      catchError(e => throwError(e))
    ).subscribe(
      () => {},
      e => {
        processDone.emit(false);
        if (e instanceof MainzellisteError && e.errorMessage == ErrorMessages.CREATE_CONSENT_REJECTED) {
          this.openConsentRejectedDialog(dataModel, processDone);
        } else if (e instanceof MainzellisteError && e.errorMessage == ErrorMessages.CREATE_CONSENT_INACTIVE) {
          this.openConsentInactivatedDialog(dataModel, processDone);
        }
      },
      () => {
        processDone.emit(true)
        this.loadConsents()
      }
    );
  }

  private openConsentRejectedDialog(dataModel: Consent, processDone: EventEmitter<boolean>) {
    const dialogRef = this.consentRejectedDialog.open(ConsentRejectedDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.editConsent(dataModel, true, processDone);
    });
  }

  private openConsentInactivatedDialog(dataModel: Consent, processDone: EventEmitter<boolean>) {
    const dialogRef = this.consentInactivatedDialog.open(ConsentInactivatedDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.editConsent(dataModel, true, processDone);
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

  getIdTypes():IdType[] {
    if (this.idTypes.length == 0){
      this.idTypes = [
        ...this.patientListService.getUniqueIdTypes(false, "C")
        .map(t => { return {name: t, isExternal: false, isAssociated: false } }),
        ...this.patientListService.getAssociatedIdTypes(false, "C")
        .map(t => { return {name: t, isExternal: false, isAssociated: true } })
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
        this.generateId(result.idType, result.idString, result.resultIdType);
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
}
