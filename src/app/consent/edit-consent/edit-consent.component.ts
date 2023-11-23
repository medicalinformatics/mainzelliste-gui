import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {ConsentService} from "../consent.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Consent} from "../consent.model";
import {GlobalTitleService} from "../../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-consent',
  templateUrl: './edit-consent.component.html',
  styleUrls: ['./edit-consent.component.css']
})
export class EditConsentComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  dataModel!: Consent;
  consentId!: string;
  idType!: string;
  idString!: string;

  constructor(
    private consentService: ConsentService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: GlobalTitleService,
    private translate: TranslateService
  ) {
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('editConsent.title_edit_consent'), false, "assignment_turned_in");
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
    this.idType = this.route.snapshot.paramMap.get('idType') ?? "";
    this.idString = this.route.snapshot.paramMap.get('idString') ?? "";
    this.consentId = this.route.snapshot.paramMap.get('id') ?? "";
    this.consentService.readConsent(this.consentId).then(c => this.dataModel = c);
  }

  async editConsent() {
    this.dataModel.patientId = {idType: this.idType, idString: this.idString};
    await this.consentService.editConsent(this.dataModel);
    await this.router.navigate(["/idcard", this.idType, this.idString]);
  }

  async cancel() {
    await this.router.navigate(["/idcard", this.idType, this.idString]);
  }
}