import {Component, OnInit} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Id, PatientListService} from "../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalTitleService} from "../services/global-title.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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
    this.titleService.setTitle("Patienten löschen", false, "delete")
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }

  async deletePatient() {
    await this.patientService.deletePatient(this.patient)
    .then(() => this.router.navigate(['/patientlist']).then());
  }

  openDeletePatientDialog(): void {
    const dialogRef = this.dialog.open(DeletePatientDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deletePatient().then();
    });
  }
}

@Component({
  selector: 'delete-patient-dialog',
  templateUrl: 'delete-patient-dialog.html',
})
export class DeletePatientDialog {
  constructor(
    public dialogRef: MatDialogRef<DeletePatientDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
