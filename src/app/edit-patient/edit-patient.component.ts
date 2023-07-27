import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {Id, PatientListService} from "../services/patient-list.service";
import {PatientService} from "../services/patient.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalTitleService} from "../services/global-title.service";
import {ErrorNotificationService} from "../services/error-notification.service";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  patient: Patient = new Patient();
  private idString: string = "";
  private idType: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public errorNotificationService: ErrorNotificationService,
    private patientListService: PatientListService,
    private titleService: GlobalTitleService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    })
    this.titleService.setTitle("Patienten bearbeiten", false, "edit")
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }

  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  editPatient() {
    this.errorNotificationService.clearMessages();
    this.patientListService.editPatient(this.patient).then( () =>
      this.router.navigate(["/patientlist"]).then()
    );
  }
}


