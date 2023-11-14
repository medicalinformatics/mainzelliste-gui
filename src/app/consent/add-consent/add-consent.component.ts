import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Consent} from "../consent.model";
import {GlobalTitleService} from "../../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';
import {ConsentService} from "../consent.service";

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
  translate: TranslateService;

  constructor(
    translate: TranslateService,
    private consentService: ConsentService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: GlobalTitleService
  ) {
    this.translate = translate;
    this.changeTitle();
  }

  ngOnInit(): void {
    this.idType = this.route.snapshot.paramMap.get('idType') ?? "";
    this.idString = this.route.snapshot.paramMap.get('idString') ?? "";
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('addConsent.title_add_consent'), false, "assignment_turned_in");
  }

  async addConsent() {
    this.dataModel.patientId = {idType: this.idType, idString: this.idString};
    await this.consentService.addConsent(this.dataModel);
    await this.router.navigate(["/idcard", this.idType, this.idString]);
  }
}
