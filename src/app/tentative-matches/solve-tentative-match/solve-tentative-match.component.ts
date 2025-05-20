import {Component, OnInit} from '@angular/core';
import {Patient} from "../../model/patient";
import {GlobalTitleService} from "../../services/global-title.service";
import {TranslateService} from "@ngx-translate/core";
import {PatientListService} from "../../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from '@angular/material/dialog';
import {SolveTentativeOperationType} from "../../model/solve-tentative-payload";
import {ErrorMessage, ErrorMessages} from "../../error/error-messages";
import {HttpErrorResponse} from "@angular/common/http";
import {MergeTentativeMatchDialogComponent} from "./dialog/merge-tentative-match-dialog.component";
import {throwError} from "rxjs";
import { Field } from 'src/app/model/field';
import { IdentityDialogComponent } from './dialog/secondary-identities-dialog.component';

@Component({
  selector: 'app-solve-tentative-match-patient',
  templateUrl: './solve-tentative-match.component.html',
  styleUrls: ['./solve-tentative-match.component.css']
})
export class SolveTentativeMatchComponent implements OnInit {
  private readonly solveTentativeErrors: ErrorMessage[] = [
    ErrorMessages.SOLVE_TENTATIVE_MERGE_FAILED_MAIN_IDENTITY_IS_SECONDARY,
    ErrorMessages.SOLVE_TENTATIVE_MERGE_FAILED_SECONDARY_IDENTITY_ID_MAIN,
    ErrorMessages.SOLVE_TENTATIVE_MERGE_FAILED_SECONDARY_IDENTITY_LINKED
  ]

  tentativeMatchId: number = 0;
  patient1: Patient | undefined;
  patient2: Patient | undefined;
  defaultPatient: Patient = new Patient();
  mainPatient: number = 1; // Index of the patient that is the main patient (aka which ID is the main ID)

  fields: Field[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: GlobalTitleService,
    private readonly patientListService: PatientListService,
    public mergeTentativeConfirmDialog: MatDialog,
    public identityDialog: MatDialog,
    public translate: TranslateService,

  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.tentativeMatchId = parseInt(params["id"] ?? "0");
    });
    this.changeTitle();
  }

  ngOnInit(): void {
    this.loadTentativeMatch();
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('solve_tentatives.title'), false, "alt_route");
  }

  private loadTentativeMatch() {
    this.patientListService.getTentative(this.tentativeMatchId)
    .subscribe({
      next: (r) => {
        this.patient1 = r.bestMatchPatient
        this.patient2 = r.assignedPatient
      },
      error: e => {
        if (e instanceof HttpErrorResponse && (e.status == 404)) {
          this.router.navigate(['/**']).then();
        }
        return throwError(() => e)
      }
    })
  }

  mergePatients(force: boolean) {
    this.patientListService.solveTentative(this.tentativeMatchId, SolveTentativeOperationType.merge,
      this.mainPatient == 1 ? this.patient1?.ids[0] : this.patient2?.ids[0], force)
    .subscribe({
      next: () => { this.router.navigate(["/tentatives"]).then()},
      error: e => {
        if (e instanceof HttpErrorResponse && this.solveTentativeErrors.find(msg => msg.match(e))) {
          this.openMergeTentativeDialog();
        }
      }
    });
  }

  splitPatients(){
    this.patientListService.solveTentative(this.tentativeMatchId, SolveTentativeOperationType.split)
    .subscribe({
      next: () => { this.router.navigate(["/tentatives"]).then()},
      error: e => {
        if (e instanceof HttpErrorResponse && this.solveTentativeErrors.find(msg => msg.match(e))) {
          this.openMergeTentativeDialog();
        }
      }
    });
  }

  setMainPatient(index: number) {
    this.mainPatient = index;
  }

  getIdString(patient: Patient | undefined): string {
    return patient?.ids?.[0]?.idString ?? '';
  }
   getIdType(patient: Patient | undefined): string {
    return patient?.ids?.[0]?.idType ?? '';
  }

  private openMergeTentativeDialog() {
    const dialogRef = this.mergeTentativeConfirmDialog.open(MergeTentativeMatchDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.mergePatients(true);
    });
  }

  openIdentityDialog(idString : String, idType: String){
    const dialogRef = this.identityDialog.open(IdentityDialogComponent, {
      width: '400px',
      data: { idString: idString, idType: idType}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
  }

