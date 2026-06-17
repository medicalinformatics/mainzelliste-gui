import { Component, OnInit } from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {ActivatedRoute, Router} from "@angular/router";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    imports: [TranslatePipe]
})
/**
 * This Component implements a basic Error Message. It should only be used for fatal errors (e.g. patientlist instance is not reachable).
 * For other errors you should refer to **/
export class ErrorComponent implements OnInit {

  public message: string = "An unspecified error occurred, please contact your administrator."
  public status?: string;

  constructor(appConfigService: AppConfigService, router: Router, route: ActivatedRoute) {
    route.queryParams.subscribe((params) => {
      if (params["message"] !== undefined)
        this.message = params["message"]
      if (params["status"] !== undefined)
        this.status= params["status"]
    })
  }

  ngOnInit(): void {
  }

}
