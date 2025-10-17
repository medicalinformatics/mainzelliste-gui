import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Patient } from "../../model/patient";
import { PatientListService } from "../../services/patient-list.service";
import { GlobalTitleService } from "../../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';
import { Id } from "../../model/id";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-patientdata',
  templateUrl: './edit-patientdata.component.html'
})
export class EditPatientdataComponent implements OnInit {
  patient: Patient = new Patient();
  public idString: string = "";
  public idType: string = "";

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private titleService: GlobalTitleService,
    public dialogRef?: MatDialogRef<EditPatientdataComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { idType: string, idString: string }
  ) {
    if (data) {
      this.idType = data.idType;
      this.idString = data.idString;
    }
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('editPatient.title_edit_patient'), false, "edit");
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R").subscribe(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0], false, false);
    });
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
  }

  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  editPatient() {
    this.patientListService.editPatient(new Id(this.idType, this.idString), this.patient, true).then(() => {
      if (this.dialogRef) {
        this.dialogRef.close(true);
      } else {
        this.router.navigate(["/idcard", this.idType, this.idString]);
      }
    });
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(["/idcard", this.idType, this.idString]);
    }
  }
}
