import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InfoComponent} from "./info/info.component";
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {PatientlistViewComponent} from "./patientlist-view/patientlist-view.component";
import {CreatePatientComponent} from "./createPatient/createPatient.component";
import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {DeleteMultiplePatientsComponent} from "./delete-multiple-patients/delete-multiple-patients.component";
import {ErrorComponent} from "./error/error.component";
import {SessionGuard} from "./guards/session-guard.service";
import {LogoutComponent} from "./logout/logout.component";


const routes: Routes = [
  // TODO: All Paths should have english wording.
  {path: '', canActivateChild: [SessionGuard], children: [
      {path: '', pathMatch: 'full' ,redirectTo: 'patientlist'},
      {path: 'add-new-patient', component: CreatePatientComponent},
      {path: 'info', component: InfoComponent},
      {path: 'audittrail', component: AudittrailComponent},
      {path: 'idcard/:idType/:idString', component: IdcardComponent}, ///:patientid -  /:id
      {path: 'merge-patients', component: MergePatientsComponent}, ///:ids
      {path: 'patientlist', component: PatientlistViewComponent},
      {path: 'edit-patient', component: EditPatientComponent}, // /:patientid
      {path: 'delete-patient', component: DeletePatientComponent}, // /:patientid
      {path: 'delete-patients', component:DeleteMultiplePatientsComponent} // /:ids
  ]},

  // Needs to be outside, because we want message why user couldn't authenticate
  {path: 'error', component: ErrorComponent},
  {path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[AudittrailComponent, IdcardComponent, MergePatientsComponent, PatientlistViewComponent, CreatePatientComponent,EditPatientComponent,DeletePatientComponent, DeleteMultiplePatientsComponent, InfoComponent]
