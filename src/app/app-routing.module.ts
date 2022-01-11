import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PatientlistComponent} from "./patientlist/patientlist.component";
import {InfoComponent} from "./info/info.component";
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {SimilarPatientComponent} from "./similarPatient/similarPatient.component";
import {PatientlistViewComponent} from "./patientlist-view/patientlist-view.component";
import {CreatePatientComponent} from "./createPatient/createPatient.component";
import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {DeleteMultiplePatientsComponent} from "./delete-multiple-patients/delete-multiple-patients.component";


const routes: Routes = [
  {path: 'neuen-patient-erstellen', component: CreatePatientComponent},
  {path: 'info', component: InfoComponent},
  {path: 'audittrail', component: AudittrailComponent},
  {path: 'idcard', component: IdcardComponent},
  {path: 'similar-patient', component: SimilarPatientComponent},
  {path: 'patienten-zusammenfuehren', component: MergePatientsComponent},
  {path:'patientenliste', component: PatientlistViewComponent},
  {path: 'edit-patient', component: EditPatientComponent},
  {path: 'delete-patient', component: DeletePatientComponent},
  {path: 'patienten-loeschen', component:DeleteMultiplePatientsComponent},
  {path: '', redirectTo: 'patientenliste', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[PatientlistComponent, AudittrailComponent, IdcardComponent, SimilarPatientComponent, MergePatientsComponent, PatientlistViewComponent, CreatePatientComponent,EditPatientComponent,DeletePatientComponent, DeleteMultiplePatientsComponent, InfoComponent]
