import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  magicLogo: string = "assets/images/magic-logo.png";
  dkfzLogo: string = "assets/images/dkfzLogo-small.png";
  ummLogo: string = "assets/images/umm-logo.png";
  medmaLogo: string = "assets/images/medma-logo.png";
  version: string = "";
  year: number;
  startYear: string = " 2021 - ";

  constructor(
    appConfig: AppConfigService
  ) {
    this.version = appConfig.getVersion();
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

}
