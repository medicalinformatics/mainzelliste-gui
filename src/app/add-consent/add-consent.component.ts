import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {ConsentService} from "../consent.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Consent} from "../model/consent";
import {GlobalTitleService} from "../services/global-title.service";

@Component({
  selector: 'app-add-consent',
  templateUrl: './add-consent.component.html',
  styleUrls: ['./add-consent.component.css']
})
export class AddConsentComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  dataModel!: Consent;
  idType!: string;
  idString!: string;

  constructor(
    private consentService: ConsentService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: GlobalTitleService
  ) {
    this.titleService.setTitle("Einwilligung Hinzufügen", false, "assignment_turned_in");
  }

  ngOnInit(): void {
    this.idType = this.route.snapshot.paramMap.get('idType') ?? "";
    this.idString = this.route.snapshot.paramMap.get('idString') ?? "";
  }

  async addConsent() {
    this.dataModel.patientId = {idType: this.idType, idString: this.idString};
    await this.consentService.addConsent(this.dataModel);
    await this.router.navigate(["/idcard", this.idType, this.idString]);
  }
}
