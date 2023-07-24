import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Id, PatientListService} from "../services/patient-list.service";
import {Patient} from "../model/patient";
import {GlobalTitleService} from "../services/global-title.service";

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})

export class IdcardComponent implements OnInit {
  public idString: string = "";
  public idType: string = "";
  public patient: Patient = new Patient();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private titleService: GlobalTitleService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    })
    this.titleService.setTitle("ID Card", false, "badge")
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }
}
