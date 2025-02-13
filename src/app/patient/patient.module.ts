import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {
  CreatePatientComponent,
  CreatePatientTentativeDialog
} from "./create-patient/create-patient.component";
import {
  EditPatientComponent,
  EditPatientTentativeDialog
} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {PatientFieldsComponent} from "./patient-fields/patient-fields.component";
import {PatientPseudonymsComponent} from "./patient-pseudonyms/patient-pseudonyms.component";
import {ExternalPseudonymsComponent} from "./external-pseudonyms/external-pseudonyms.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {
  GenerateIdDialog
} from './external-pseudonyms/dialogs/generate-id/generate-id-dialog.component';
import {
  ShowRelatedIdDialog
} from './patient-pseudonyms/dialogs/show-related-id-dialog/show-related-id-dialog.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ViewPatientComponent } from './view-patient/view-patient.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClipboardModule,
    RouterModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    PatientFieldsComponent,
    ViewPatientComponent,
    PatientPseudonymsComponent
  ],
  declarations: [
    PatientFieldsComponent,
    ViewPatientComponent,
    PatientPseudonymsComponent,
    ExternalPseudonymsComponent,
    CreatePatientComponent,
    CreatePatientTentativeDialog,
    EditPatientComponent,
    EditPatientTentativeDialog,
    DeletePatientComponent,
    GenerateIdDialog,
    ShowRelatedIdDialog
  ]
})
export class PatientModule {
}
