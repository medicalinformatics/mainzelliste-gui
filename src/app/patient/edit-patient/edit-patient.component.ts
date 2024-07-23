import {Component, OnInit} from '@angular/core';
import {Patient} from "../../model/patient";
import {PatientListService} from "../../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalTitleService} from "../../services/global-title.service";
import {ErrorNotificationService} from "../../services/error-notification.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MainzellisteError} from "../../model/mainzelliste-error.model";
import {ErrorMessages} from "../../error/error-messages";
import {Id} from "../../model/id";
import { TranslateService } from '@ngx-translate/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Permission} from "../../model/permission";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  public readonly Permission = Permission;

  patient: Patient = new Patient();
  private idString: string = "";
  private idType: string = "";

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public errorNotificationService: ErrorNotificationService,
    private patientListService: PatientListService,
    private titleService: GlobalTitleService,
    public authorizationService: AuthorizationService,
    public dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    })
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('editPatient.title_edit_patient'), false, "edit");
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R").subscribe(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })
  }

  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  editPatient(sureness: boolean) {
    this.errorNotificationService.clearMessages();
    this.patientListService.editPatient(new Id(this.idType, this.idString), this.patient, sureness).then( () =>
      this.router.navigate(["/idcard", this.idType, this.idString]).then()
    )
    .catch( e => {
      if(e instanceof MainzellisteError && e.errorMessage == ErrorMessages.EDIT_PATIENT_CONFLICT_POSSIBLE_MATCH){
        this.openEditPatientTentativeDialog();
      }
    });
  }

  openEditPatientTentativeDialog(): void {
    const dialogRef = this.dialog.open(EditPatientTentativeDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.editPatient(true);
    });
  }
}

@Component({
  selector: 'edit-patient-tentative-dialog',
  templateUrl: 'edit-patient-tentative-dialog.html',
})
export class EditPatientTentativeDialog {
  constructor(
    public dialogRef: MatDialogRef<EditPatientTentativeDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

