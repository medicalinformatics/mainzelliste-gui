import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { AppConfigService } from "src/app/app-config.service";
import { AddPatientTokenData } from "src/app/model/add-patient-token-data";
import { Field } from "src/app/model/field";
import { Id } from "src/app/model/id";
import { MainzellisteUnknownError } from "src/app/model/mainzelliste-unknown-error";
import { Patient } from "src/app/model/patient";
import { PatientList } from "src/app/model/patientlist";
import { PatientListService } from "src/app/services/patient-list.service";
import { SessionService } from "src/app/services/session.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'similar-patient-dialog',
    templateUrl: './similar-patient-dialog.html',
    styleUrls: ['./similar-patient-dialog.css']
})

export class SimilarPatientDialog {
    private patientList: PatientList;

    match: Patient = new Patient();
    patient: any;
    resultsFound: boolean = false;
    displayedColumns: string[] = [];
    fields: Field[];
    constructor(
        private translate: TranslateService,
        public configService: AppConfigService,
        public dialogRef: MatDialogRef<SimilarPatientDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private patientListService: PatientListService,
        private router: Router
    ) {
        this.patientList = this.configService.data[0];
        this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
        this.patient = data.patient || [];
        this.displayedColumns = [...this.fields.map(field => field.name)];
        this.displayedColumns.push("action");
        console.log(this.patient);
        this.patientListService.getMatches(this.patient).subscribe({
            next: response => {
                let similarityScore = response.data[0].similarityScore;
                if (similarityScore > 0.8) {
                    this.resultsFound = true;
                    let id = response.data[0].biobankId ?? ""
                    this.loadPatient(id);
                } else {
                    this.resultsFound = false;
                }
            }
        }
        )

    }
    goToPatientIdCard(match : Patient) {
        this.dialogRef.close();
        this.router.navigate(["/idcard",match.ids[0].idType, match.getIdString(match.ids[0].idType)]).then();
    }

    loadPatient(idString: string) {
        console.log("loadPatient called")
        this.patientListService.readPatient(new Id("biobankId", idString), "R")
            .pipe(
                catchError(e => {
                    if (e instanceof HttpErrorResponse && (e.status == 404)) {
                        this.router.navigate(['/**']).then();
                    }
                    return throwError(new MainzellisteUnknownError(this.translate.instant('error.patient_list_service_resolve_add_patient_token'), e, this.translate))
                })
            )
            .subscribe(
                patients => {
                    this.match = this.patientListService.convertToDisplayPatient(patients[0]);
                }
             );
    }

    cancel(): void {
        this.dialogRef.close();
    }
}