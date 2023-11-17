import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {CreatePatientComponent, CreatePatientTentativeDialog} from "./create-patient/create-patient.component";
import {EditPatientComponent, EditPatientTentativeDialog} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {DeletePatientDialog} from "../idcard/dialogs/delete-patient-dialog";
import {PatientRoutingModule} from "./patient-routing.module";
import {PatientFieldsComponent} from "./patient-fields/patient-fields.component";
import {PatientPseudonymsComponent} from "./patient-pseudonyms/patient-pseudonyms.component";
import {ExternalPseudonymsComponent} from "./external-pseudonyms/external-pseudonyms.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule,
    SharedModule,
    ClipboardModule
  ],
  exports: [
    PatientFieldsComponent,
    PatientPseudonymsComponent
  ],
  declarations: [
    PatientFieldsComponent,
    PatientPseudonymsComponent,
    ExternalPseudonymsComponent,
    CreatePatientComponent,
    CreatePatientTentativeDialog,
    EditPatientComponent,
    EditPatientTentativeDialog,
    DeletePatientComponent,
    DeletePatientDialog]
})
export class PatientModule {
}
