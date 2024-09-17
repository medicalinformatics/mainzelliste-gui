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
import {CreateConsentTemplateComponent} from "./create-consent-template/create-consent-template.component";
import { TentativeMatchesListComponent } from './tentative-matches-list/tentative-matches-list.component';
import { MatTableModule } from '@angular/material/table';


@NgModule({
    declarations: [AudittrailComponent, MergePatientsComponent, SimilarPatientComponent, HistorieComponent, DeleteMultiplePatientsComponent, CreateConsentTemplateComponent],
    imports: [
        CommonModule,
        SharedModule,
        AppModule,
        RouterModule,
        PatientModule,
        MatTableModule,
    ]
})
export class ExperimentalModule {
}
