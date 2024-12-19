import {Component, OnInit} from '@angular/core';
import {Patient} from "../../model/patient";
import {PatientService} from "../../services/patient.service";
import {GlobalTitleService} from "../../services/global-title.service";
import {TranslateService} from "@ngx-translate/core";
import {PatientListService} from "../../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-merge-split-patient',
  templateUrl: './merge-split-patient.component.html',
  styleUrls: ['./merge-split-patient.component.css']
})
export class MergeSplitPatientComponent implements OnInit {
  tentativeMatchId: number = 0;
  patient1: Patient | undefined;
  patient2: Patient | undefined;
  mainPatient: number = 1; // Index of the patient that is the main patient (aka which ID is the main ID)

  fields: Array<string> = [];
  confirm: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private titleService: GlobalTitleService,
    public patientService: PatientService,
    private patientListService: PatientListService,
    public confirmDialog: MatDialog,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.tentativeMatchId = parseInt(params["id"] ?? "0");
    });
    this.changeTitle();
  }

  ngOnInit(): void {
    this.loadPatient();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('mergePatients.title'), false, "merge_type");
  }

  private loadPatient() {
    this.patientListService.getTentative(this.tentativeMatchId).subscribe( r => {
      this.patient1 = r.bestMatchPatient
      this.patient2 = r.assignedPatient
    })
  }

  async mergePatients() {
    let deleteFlag: boolean = false;
    /* const dialogRef = this.confirmDialog.open(MergePatientConfirmDialog, {
       width: '900px',
       data: { mainPatient: this.mainPatient, isDelete: deleteFlag },
       panelClass: 'dialogClass'
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
     */
  }

  setMainPatient(index: number) {
    this.mainPatient = index;
  }
  getMainPatient() {
    return this.mainPatient;
  }

}
