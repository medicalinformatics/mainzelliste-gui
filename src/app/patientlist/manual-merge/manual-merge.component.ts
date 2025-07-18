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
import {catchError, throwError, forkJoin} from "rxjs";
import { Field } from 'src/app/model/field';
import { IdentityDialogComponent } from 'src/app/shared/components/secondary-identities/dialog/secondary-identities-dialog.component';
import { Id } from 'src/app/model/id';
import { MainzellisteUnknownError } from 'src/app/model/mainzelliste-unknown-error';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-manual-merge-patient',
  templateUrl: './manual-merge.component.html',
  styleUrls: ['./manual-merge.component.css']
})
export class ManualMergeComponent implements OnInit {
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

  mainIdType : string ="";

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: GlobalTitleService,
    private readonly patientListService: PatientListService,
    private authorizationService: AuthorizationService,
    public mergeTentativeConfirmDialog: MatDialog,
    public identityDialog: MatDialog,
    public translate: TranslateService,

  ) {
    this.activatedRoute.params.subscribe((params) => {
      let ids = [];
      if (params['ids']  !== undefined)
         ids = params['ids'];
      if(params['mainIdType'] !== undefined)
        this.mainIdType = params['mainIdType'];
      const idArray = ids ? ids.split(',') : [];
      this.loadPatients(idArray);
    });
    this.changeTitle();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });
  }

  loadPatients(idArray: string[]) {
  const observables = idArray.map(idString =>
    this.patientListService.readPatient(new Id(this.mainIdType, idString), "R").pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && e.status === 404) {
          this.router.navigate(['/**']).then();
        }
        return throwError(
          new MainzellisteUnknownError(
            this.translate.instant('error.patient_list_service_resolve_add_patient_token'),
            e,
            this.translate
          )
        );
      })
    )
  );

  forkJoin(observables).subscribe({
    next: (patientArrays: any[][]) => {
      const [firstPatientArray, secondPatientArray] = patientArrays;
      this.patient1 = this.patientListService.convertToDisplayPatient(firstPatientArray[0], false, true, this.authorizationService.getTenants());
      this.patient2 = this.patientListService.convertToDisplayPatient(secondPatientArray[0], false, true, this.authorizationService.getTenants()); 
    },
    error: (error) => {
      console.error("Error loading patients", error);
    }
  });

}


  changeTitle() {
    this.titleService.setTitle(this.translate.instant('solve_tentatives.title'), false, "alt_route");
  }


  mergePatients() {
   
  }

  cancel(){
    this.router.navigate(["/patientlist"]).then()
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

  openIdentityDialog(idString : String, idType: String){
    const dialogRef = this.identityDialog.open(IdentityDialogComponent, {
      data: { idString: idString, idType: idType}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
  }

