import {Component, OnInit} from '@angular/core';
import {Patient} from "../../model/patient";
import {PatientService} from "../../services/patient.service";
import {PatientListService} from "../../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalTitleService} from "../../services/global-title.service";
import {MatDialog} from "@angular/material/dialog";
import {Id} from "../../model/id";
import {TranslateService} from '@ngx-translate/core';
import {
  ConfirmDeleteDialogComponent
} from "../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-delete-patient',
  templateUrl: './delete-patient.component.html',
  styleUrls: ['./delete-patient.component.css']
})

export class DeletePatientComponent implements OnInit {

  patient: Patient = new Patient();
  private idString: string = "";
  private idType: string = "";

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientListService: PatientListService,
    private patientService: PatientService,
    private titleService: GlobalTitleService,
    public dialog: MatDialog
  ) {

    activatedRoute.params.subscribe((params) => {
      console.log(this.idType, this.idString); // kommt hier nicht rein
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    })
    this.changeTitle();
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
    this.patientListService.readPatient(new Id(this.idType, this.idString), "R").subscribe(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('deletePatient.title'), false, "delete");
  }

  async deletePatient() {
    this.patientService.deletePatient(this.patient)
    .subscribe(() => this.router.navigate(['/patientlist']).then());
  }

  openDeletePatientDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_patient"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deletePatient().then();
    });
  }
}
