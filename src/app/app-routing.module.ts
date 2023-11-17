import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InfoComponent} from "./info/info.component";
// import {AudittrailComponent} from "./audittrail/audittrail.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {PatientlistViewComponent} from "./patientlist-view/patientlist-view.component";
import {CreatePatientComponent} from "./createPatient/createPatient.component";
// import {MergePatientsComponent} from "./mergePatients/mergePatients.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {DeleteMultiplePatientsComponent} from "./delete-multiple-patients/delete-multiple-patients.component";
import {ErrorComponent} from "./error/error.component";
import {LogoutComponent} from "./logout/logout.component";
import {AuthGuard} from "./guards/auth-guard.service";

import {ConsentComponent} from "./consent/consent.component";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";
import { ProjektIdComponent } from './projekt-id/projekt-id.component';

const routes: Routes = [
  // TODO: All Paths should have english wording.
  {
    path: '', canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {path: '', pathMatch: 'full', redirectTo: 'patientlist'},
      {path: 'add-new-patient', component: CreatePatientComponent, data : { permission: 'addPatient' }},
      {path: 'projekt-id', component: ProjektIdComponent},
      {path: 'info', component: InfoComponent},
      // {path: 'audittrail', component: AudittrailComponent},
      {path: 'idcard/:idType/:idString', component: IdcardComponent, data : { permission: 'readPatients' }},
      // {path: 'merge-patients', component: MergePatientsComponent},
      {path: 'patientlist', component: PatientlistViewComponent, data : { permission: 'readPatients' }},
      {path: 'edit-patient/:idType/:idString', component: EditPatientComponent, data : { permission: 'editPatient'}},
      {path: 'delete-patient/:idType/:idString', component: DeletePatientComponent, data : { permission: 'deletePatient' }},
      {path: 'delete-patients', component: DeleteMultiplePatientsComponent, data : { permission: 'deletePatient' }},
      {path: 'consent/:idType/:idString', component:ConsentComponent, data : { permission: 'readConsent' }},
      {path: 'patient/:idType/:idString/add-consent', component:AddConsentComponent, data : { permission: 'addConsent' }},
      {path: 'patient/:idType/:idString/edit-consent/:id', component:EditConsentComponent, data : { permission: 'editConsent' }}
    ]
  },

  // Needs to be outside, because we want message why user couldn't authenticate
  {path: 'error', component: ErrorComponent},
  {path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[IdcardComponent, PatientlistViewComponent, CreatePatientComponent,EditPatientComponent,DeletePatientComponent, DeleteMultiplePatientsComponent, InfoComponent, ConsentComponent]
