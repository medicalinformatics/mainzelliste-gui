import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";
import {Id} from "../model/id";
import {ConsentService} from "../consent.service";
import {MatTable} from "@angular/material/table";

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
  public loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private titleService: GlobalTitleService,
    public consentService: ConsentService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    });
    this.titleService.setTitle("ID Card", false, "badge")
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });

    //load consent list
    this.loading = true;
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
        this.loading = false;
      },
      error => this.loading = false);
  }

  async editConsent(row: ConsentRow) {
    await this.router.navigate(["patient", this.idType, this.idString, 'edit-consent', row.id]);
  }
}
