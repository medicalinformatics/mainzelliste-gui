import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {SimilarPatientComponent} from "./similarPatient/similarPatient.component";
import {HistorieComponent} from "./historie/historie.component";
import {DeleteMultiplePatientsComponent} from "./delete-multiple-patients/delete-multiple-patients.component";
import {RouterModule} from "@angular/router";



@NgModule({
    declarations: [AudittrailComponent, MergePatientsComponent, SimilarPatientComponent, HistorieComponent, DeleteMultiplePatientsComponent],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class ExperimentalModule {
}
