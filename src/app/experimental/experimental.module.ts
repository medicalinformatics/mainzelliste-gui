import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {SimilarPatientComponent} from "./similarPatient/similarPatient.component";
import {SharedModule} from "../shared/shared.module";
import {HistorieComponent} from "./historie/historie.component";
import {
    DeleteMultiplePatientsComponent
} from "./delete-multiple-patients/delete-multiple-patients.component";
import {RouterModule} from "@angular/router";
import {PatientModule} from "../patient/patient.module";
import {PatientFieldsComponent} from "../patient/patient-fields/patient-fields.component";


@NgModule({
    declarations: [AudittrailComponent, MergePatientsComponent, SimilarPatientComponent, HistorieComponent, DeleteMultiplePatientsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        PatientModule
    ],
    exports: [
        PatientFieldsComponent
    ]
})
export class ExperimentalModule {
}
