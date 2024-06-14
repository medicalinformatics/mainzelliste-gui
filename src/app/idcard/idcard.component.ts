import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ConsentRow, ConsentsView} from "../consent/consent.model";
import {mergeMap} from "rxjs/operators";
import {DeleteConsentDialog} from "./dialogs/delete-consent-dialog";

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

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private patientService: PatientService,
    private titleService: GlobalTitleService,
    public consentDialog: MatDialog,
    public deletePatientDialog: MatDialog,
    public deleteConsentDialog: MatDialog,
    public newIdDialog: MatDialog,
    public consentService: ConsentService
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
    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    //load consent list
    if(this.consentService.isServiceEnabled())
      this.loadConsents();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('idcard.title_id_card'), false, "badge");
  }

  private loadPatient() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R")
      .then(
        patients => {
          this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
        })
      .catch(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
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

  generateId(newIdType: string) {
    this.patientListService.generateId(this.idType, this.idString, newIdType).subscribe(() => this.loadPatient());
  }

  hasAllTemplateIds(): boolean {
    return [...this.consentsView.consentTemplates.keys()].every(templateId =>
        this.consentsView.consentRows.some(v => v.templateId == templateId))
  }


  openConsentDialog() {
    const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
      width: '900px',
      data: {templates: new Map([...this.consentsView.consentTemplates].filter(e =>
            !this.consentsView.consentRows.some(r => r.templateId == e[0]))
        )}
    });

    dialogRef.afterClosed().subscribe(dataModel => {
      if (dataModel?.consent) {
        dataModel.consent.patientId = {idType: this.idType, idString: this.idString};
        this.consentService.addConsent(dataModel.consent).subscribe(e => this.loadConsents());
      }
    });
  }

  hasAllIds(): boolean {
    return this.patientListService.getNewIdType(this.patient).length == 0;
  }
  openNewIdDialog(): void {
    const dialogRef = this.newIdDialog.open(NewIdDialog, {
      data: this.patientListService.getNewIdType(this.patient)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.generateId(result.value);
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
