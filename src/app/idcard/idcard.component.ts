import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";
import {Id} from "../model/id";
import {ConsentService} from "../consent.service";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {PatientService} from "../services/patient.service";
import {DeletePatientDialog} from "./dialogs/delete-patient-dialog";
import { NewIdDialog } from './dialogs/new-id-dialog';
import { TranslateService } from '@ngx-translate/core';
import {ConsentDialogComponent} from "../consent/consent-dialog/consent-dialog.component";

export interface ConsentRow {id: string, date:string, title: string, period:string, version?:string}

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {

  public idString: string = "";
  public idType: string = "";
  public patient: Patient = new Patient();
  public displayedConsentColumns: string[] = ['date', 'title', 'period', 'version'];
  public consents: ConsentRow[] = [];
  @ViewChild('consentTable') consentTable!: MatTable<ConsentRow>;
  public loadingConsents: boolean = false;
  translate: TranslateService;

  constructor(
    translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private patientService: PatientService,
    private titleService: GlobalTitleService,
    public consentDialog: MatDialog,
    public deleteDialog: MatDialog,
    public newIdDialog: MatDialog,
    public consentService: ConsentService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    });
    this.translate = translate;
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
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }

  private loadConsents() {
    this.loadingConsents = true;
    this.consents = []
    this.consentService.getConsents(this.idType, this.idString).then(dataModels => {
          dataModels.forEach(m => {
            //map period
            let period = "unbegrenzt";
            if (m.validUntil) {
              period = (!m.validFrom ? "??" : new Date(m.validFrom).toLocaleDateString()) + " - "
                  + new Date(m.validUntil).toLocaleDateString();
            }

            this.consents.push({
              id: m.id!,
              date: new Date(m.createdAt).toLocaleDateString(),
              title: m.title,
              period: period,
              version: m.version
            });
            this.consentTable.renderRows();
          })
          this.loadingConsents = false;
        },
        error => this.loadingConsents = false);
  }

  async editConsent(row: ConsentRow) {
    await this.router.navigate(["patient", this.idType, this.idString, 'edit-consent', row.id]);
  }

  async deletePatient() {
    await this.patientService.deletePatient(this.patient)
    .then(() => this.router.navigate(['/patientlist']).then());
  }

  generateId(newIdType: string) {
    this.patientListService.generateId(this.idType, this.idString, newIdType).subscribe(() => this.loadPatient());
  }

  openConsentDialog() {
    const dialogRef = this.consentDialog.open(ConsentDialogComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(consent => {
      if (consent) {
        consent.patientId = {idType: this.idType, idString: this.idString};
        this.consentService.addConsent(consent).then(e => this.loadConsents());
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
    const dialogRef = this.deleteDialog.open(DeletePatientDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deletePatient().then();
    });
  }
}
