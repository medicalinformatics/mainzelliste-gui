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
import {LoginComponent} from "./login/login.component";

import {ConsentComponent} from "./consent/consent.component";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";

const routes: Routes = [
  // TODO: All Paths should have english wording.
  {path: '', canActivateChild: [SessionGuard], children: [
      {path: '', pathMatch: 'full' ,redirectTo: 'patientlist'},
      {path: 'add-new-patient', component: CreatePatientComponent},
      {path: 'info', component: InfoComponent},
      {path: 'audittrail', component: AudittrailComponent},
      {path: 'idcard/:idType/:idString', component: IdcardComponent},
      {path: 'merge-patients', component: MergePatientsComponent},
      {path: 'patientlist', component: PatientlistViewComponent},
      {path: 'edit-patient/:idType/:idString', component: EditPatientComponent},
      {path: 'delete-patient/:idType/:idString', component: DeletePatientComponent},
      {path: 'delete-patients', component:DeleteMultiplePatientsComponent},
      {path: 'consent/:idType/:idString', component:ConsentComponent},
      {path: 'patient/:idType/:idString/add-consent', component:AddConsentComponent},
      {path: 'patient/:idType/:idString/edit-consent/:id', component:EditConsentComponent}
    ]},

  // Needs to be outside, because we want message why user couldn't authenticate
  {path: 'error', component: ErrorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[AudittrailComponent, IdcardComponent, MergePatientsComponent, PatientlistViewComponent, CreatePatientComponent,EditPatientComponent,DeletePatientComponent, DeleteMultiplePatientsComponent, InfoComponent, ConsentComponent]
