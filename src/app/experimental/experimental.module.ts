import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {SimilarPatientComponent} from "./similarPatient/similarPatient.component";
import {SharedModule} from "../shared/shared.module";
import {AppModule} from "../app.module";
import {HistorieComponent} from "./historie/historie.component";
import {DeleteMultiplePatientsComponent} from "./delete-multiple-patients/delete-multiple-patients.component";
import {RouterModule} from "@angular/router";
import {PatientModule} from "../patient/patient.module";


@NgModule({
    declarations: [AudittrailComponent, MergePatientsComponent, SimilarPatientComponent, HistorieComponent, DeleteMultiplePatientsComponent],
    imports: [
        CommonModule,
        SharedModule,
        AppModule,
        RouterModule,
        PatientModule
    ]
})
export class ExperimentalModule {
}
