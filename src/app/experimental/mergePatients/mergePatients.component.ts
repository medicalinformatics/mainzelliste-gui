import { Component, Inject, Input, OnInit } from '@angular/core';
import { Patient } from "../../model/patient";
import { PatientService } from "../../services/patient.service";
import { GlobalTitleService } from "../../services/global-title.service";
import { TranslateService } from "@ngx-translate/core";
import { PatientListService } from "../../services/patient-list.service";
import { Id } from "../../model/id";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { MainzellisteUnknownError } from "../../model/mainzelliste-unknown-error";
import { throwError } from "rxjs";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import type { DialogProps } from "@mui/material";

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
  mainPatient: number = 1; // Index of the patient that is the main patient (aka which ID is the main ID)
  confirm: boolean = false;
  constructor(
    public translate: TranslateService,
    patientService: PatientService,
    private titleService: GlobalTitleService,
    private patientListService: PatientListService,
    public confirmDialog: MatDialog,
    private router: Router,
  ) {
    this.patientService = patientService;
    this.titleService.setTitle(this.translate.instant('mergePatients.title'), false, "merge_type")
  }

  ngOnInit(): void {
    this.loadPatient();
    //  this.patients = history.state.patients;
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

  async mergePatients() {
    // TODO: Popup to confirm and choose if delete other or keep then route to id card of final patient
    let deleteFlag: boolean = false;
    const dialogRef = this.confirmDialog.open(MergePatientConfirmDialog, {
      width: '900px',
      data: { mainPatient: this.mainPatient, isDelete: deleteFlag }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirm = result.confirm ?? false;
        deleteFlag = result.isDelete;

        if (this.confirm) {
          let finalPatient = this.mainPatient == 1 ? this.patient1 : this.patient2;
          this.router.navigate(['/idcard', finalPatient.ids[0].idType, finalPatient.ids[0].idString]);
        }
      }
    });
  }

  setMainPatient(index: number) {
    this.mainPatient = index;
  }
  getMainPatient() {
    return this.mainPatient;
  }

}

@Component({
  selector: 'mergePatient-confirm-dialog',
  templateUrl: 'mergePatient-confirm-dialog.html',
})
export class MergePatientConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<MergePatientConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mainPatient: number, isDelete: boolean }
  ) {
  }

  cancel(isDelete: boolean): void {
    const handleClose: DialogProps["onClose"] = (event: any, reason: string) => {
      if (reason && reason === "backdropClick") {
        this.dialogRef.close({ isDelete: isDelete, confirm: false });
        return;
      }
    }
    this.dialogRef.close({ isDelete: isDelete, confirm: true });

  }
}
