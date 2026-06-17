import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../../services/global-title.service";

@Component({
    selector: 'app-audittrail',
    templateUrl: './audittrail.component.html',
    styleUrls: ['./audittrail.component.css'],
    standalone: false
})
export class AudittrailComponent implements OnInit {

  constructor(
    private titleService: GlobalTitleService
  ) {
    this.titleService.setTitle("Audit-Trail");
  }

  ngOnInit(): void {
  }

}
