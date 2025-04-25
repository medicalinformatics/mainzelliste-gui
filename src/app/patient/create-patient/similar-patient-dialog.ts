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
        private httpClient: HttpClient,
        private sessionService: SessionService,
        private patientListService: PatientListService,
        private router: Router
    ) {
        this.patientList = this.configService.data[0];
        this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
        this.patient = data.patient || [];
        this.displayedColumns = [...this.fields.map(field => field.name)];
        this.displayedColumns.push("action");
        this.loadMatches().subscribe({
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

    loadMatches() {
        console.log('getCheckMatch called');
        return this.sessionService.createToken("checkMatch", new AddPatientTokenData(
            ["biobankId"]
        )).pipe(
            mergeMap(token => {
                console.log('Token received:', token);
                return this.resolveCheckMatch(token.id);
            }),
            catchError((error) => {
                console.error('Error occurred in getCheckMatch:', error);
                if (error.status >= 400 && error.status < 500) {
                    return throwError(() => new Error("failed to fetch matches"));
                } else {
                    return throwError(() => new Error("failed to fetch matches"));
                }
            })
        );
    }
    resolveCheckMatch(tokenId: string | undefined) {
        let patient: Patient = new Patient();
        patient.fields = {
            vorname: "Alf",
            nachname: "Klemt",
            geburtsname: "Salz",
            geburtsjahr: "1989",
            geburtsmonat: "08",
            geburtstag: "02"
        }
        let body = new URLSearchParams();
        for (const name in patient.fields) {
            body.set(name, patient.fields[name]);
        }
        return this.httpClient.post(this.patientList.url + "/patients/checkMatch/" + tokenId, body, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('mainzellisteApiVersion', '3.2')
        }).pipe(
            mergeMap(response => {
                type checkMatch = {
                    biobankId?: string;
                    similarityScore: number;
                };

                let result: checkMatch[] = response as checkMatch[];
                return of({ data: result });
            }),
            catchError((error) => {
                console.error('Error occurred in getCheckMatch:', error);
                if (error.status >= 400 && error.status < 500) {
                    return throwError(() => new Error("failed to fetch matches"));
                } else {
                    return throwError(() => new Error("failed to fetch matches"));
                }
            })
        );

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