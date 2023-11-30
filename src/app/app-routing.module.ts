import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoComponent} from "./info/info.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {PatientlistViewComponent} from "./patientlist-view/patientlist-view.component";
import {ErrorComponent} from "./error/error.component";
import {LogoutComponent} from "./logout/logout.component";
import {AuthGuard} from "./guards/auth-guard.service";
import {Permission} from "./model/permission";

const routes: Routes = [
  // TODO: All Paths should have english wording.
  {
    path: '', canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {path: '', pathMatch: 'full', redirectTo: 'patientlist'},
      {path: 'info', component: InfoComponent},
      // {path: 'audittrail', component: AudittrailComponent},
      {path: 'idcard/:idType/:idString', component: IdcardComponent, data : { permission: Permission.READ_PATIENT }},
      // {path: 'merge-patients', component: MergePatientsComponent},
      {path: 'patientlist', component: PatientlistViewComponent, data : { permission: Permission.READ_PATIENT }}
      // {path: 'delete-patients', component: DeleteMultiplePatientsComponent, data : { permission: 'deletePatient' }}
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
export const routingComponents =[IdcardComponent, PatientlistViewComponent, InfoComponent]
