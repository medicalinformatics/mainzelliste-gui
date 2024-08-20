import { Component, Input, OnInit } from '@angular/core';
import { Patient } from "../../model/patient";
import { PatientService } from "../../services/patient.service";
import { GlobalTitleService } from "../../services/global-title.service";
import { TranslateService } from "@ngx-translate/core";
import { PatientListService } from "../../services/patient-list.service";
import { Id } from "../../model/id";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { MainzellisteUnknownError } from "../../model/mainzelliste-unknown-error";
import { throwError } from "rxjs";

@Component({
  selector: 'app-merge-patients',
  templateUrl: './mergePatients.component.html',
  styleUrls: ['./mergePatients.component.css']
})
export class MergePatientsComponent implements OnInit {
  patientService: PatientService;
 // @Input() patients: Array<Patient> = [];
  @Input() patient1: Patient = new Patient;
  @Input() patient2: Patient = new Patient;

  @Input() fields: Array<string> = [];

  @Input() finalPatient = new Patient;
  emptyPatient = new Patient;
  mainPatient: number = 1; // Index of the patient that is the main patient (aka which ID is the main ID)

  constructor(
    public translate: TranslateService,
    patientService: PatientService,
    private titleService: GlobalTitleService,
    private patientListService: PatientListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.patientService = patientService;
    this.emptyPatient.ids = [{ idType: "Pseudonym", idString: " ", tentative: false }];
    this.titleService.setTitle(this.translate.instant('mergePatients.title'), false, "merge_type");
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);

    });
  }

  ngOnInit(): void {
    this.loadPatient();
    //  this.patients = history.state.patients;
  }

  updateFieldsOfFinalPatient(name: string, value: string) {
    this.finalPatient.fields[name] = value;
  }


  private loadPatient() {
    var patient = history.state.patients[0];
    var idType = patient.ids[0]["idType"] ?? "";
    var idString = patient.ids[0]["idString"] ?? "";
    this.patientListService.readPatient(new Id(idType, idString), "R")
      .then(
        patients => {
          this.patient1 = this.patientListService.convertToDisplayPatient(patients[0]);
        })
      .catch(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      });
    patient = history.state.patients[1];
    var idType = patient.ids[0]["idType"] ?? "";
    var idString = patient.ids[0]["idString"] ?? "";
    this.patientListService.readPatient(new Id(idType, idString), "R")
      .then(
        patients => {
          this.patient2 = this.patientListService.convertToDisplayPatient(patients[0]);
        })
      .catch(e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
      });
  }

  updatePseudonymOfFinalPatient(name: string, value: string) {
    // this.finalPatient.ids[name]=value;
    this.finalPatient.ids = this.mainPatient == 1 ? this.patient1.ids : this.patient2.ids;
  }

  mergePatients() {
    // TODO: Needs Backend Implementation
  }

  setMainPatient(index: number) {
    this.mainPatient = index;
  }
  getMainPatient() {
    return this.mainPatient;
  }
}
