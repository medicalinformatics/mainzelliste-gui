import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentModel} from "../consentModel";
import {ConsentService} from "../consent.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-consent',
  templateUrl: './add-consent.component.html',
  styleUrls: ['./add-consent.component.css']
})
export class AddConsentComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  consentModel!: ConsentModel;
  idType!: string;
  idString!: string;

  constructor(private consentService: ConsentService,
              private route:ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.idType = this.route.snapshot.paramMap.get('idType') ?? "";
    this.idString = this.route.snapshot.paramMap.get('idString') ?? "";
  }

  async addConsent() {
    this.consentModel = this.consentDetail.saveChanges();
    this.consentModel.patientId = {idType: this.idType, idString: this.idString};
    await this.consentService.addConsent(this.consentModel);
    await this.router.navigate(["/idcard", this.idType, this.idString]);
  }
}
