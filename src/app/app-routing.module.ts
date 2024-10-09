import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from "./info/info.component";
import { IdcardComponent } from "./idcard/idcard.component";
import { PatientlistViewComponent } from "./patientlist-view/patientlist-view.component";
import { ErrorComponent } from "./error/error.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthGuard } from "./guards/auth-guard.service";
import { Permission } from "./model/permission";
import { CreatePatientComponent } from "./patient/create-patient/create-patient.component";
import { EditPatientComponent } from "./patient/edit-patient/edit-patient.component";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { AddConsentComponent } from "./consent/add-consent/add-consent.component";
import { EditConsentComponent } from "./consent/edit-consent/edit-consent.component";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConsentTemplatesComponent } from "./consent/consent-templates/consent-templates.component";
import { TentativeMatchesListComponent } from './experimental/tentative-matches-list/tentative-matches-list.component';
import { MergeSplitPatientComponent } from './experimental/merge-split-patient/merge-split-patient.component';

const routes: Routes = [
  // TODO: All Paths should have english wording.
  {
    path: '', canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'patientlist' },
      { path: 'info', component: InfoComponent, data: { permission: Permission.DEFAULT } },
      { path: 'idcard/:idType/:idString', component: IdcardComponent, data: { permission: Permission.READ_PATIENT, checkIdType: true } },
      { path: 'add-new-patient', component: CreatePatientComponent, data: { permission: Permission.CREATE_PATIENT } },
      { path: 'edit-patient/:idType/:idString', component: EditPatientComponent, data: { permission: Permission.EDIT_PATIENT, checkIdType: true } },
      { path: 'patientlist', component: PatientlistViewComponent, data: { permission: Permission.READ_PATIENT } },
      { path: 'patient/:idType/:idString/add-consent', component: AddConsentComponent, data: { permission: Permission.CREATE_CONSENT, checkIdType: true } },
      // TODO support multiple permissions 'readConsent'
      { path: 'patient/:idType/:idString/edit-consent/:id', component: EditConsentComponent, data: { permission: Permission.EDIT_CONSENT, checkIdType: true } },
      // {path: 'delete-patient/:idType/:idString', pathMatch: 'full', redirectTo:  ''},
      // {path: 'merge-patients', component: MergePatientsComponent},
      // {path: 'audittrail', component: AudittrailComponent},
      // {path: 'delete-patients', component: DeleteMultiplePatientsComponent, data : { permission: 'deletePatient' }},
      { path: 'consent-templates', component: ConsentTemplatesComponent, data: { permission: Permission.CREATE_CONSENT_TEMPLATE } },
      // {path: 'create-consent-template', component: CreateConsentTemplateComponent, data: { permission: Permission.CREATE_CONSENT}},
      { path: 'matches', component: TentativeMatchesListComponent, data: { permission: Permission.EDIT_PATIENT } },
      {path: 'merge-patients', component: MergeSplitPatientComponent, data: { permission: Permission.EDIT_PATIENT, checkIdType:true}},

    ]
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  // Needs to be outside, because we want message why user couldn't authenticate
  { path: 'error', component: ErrorComponent },
  { path: 'logout', component: LogoutComponent },
  //Wild Card Route for 404 request
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
export const routingComponents = [IdcardComponent, PatientlistViewComponent, InfoComponent]
