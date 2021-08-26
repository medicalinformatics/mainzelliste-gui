import {NgModule} from '@angular/core';
import{ Routes, RouterModule} from '@angular/router';
import {AddPatientFormularComponent} from "./add-patient-formular/add-patient-formular.component";
import {PatientenlisteComponent} from "./patientenliste/patientenliste.component";
import {HomeComponent} from "./home/home.component";
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {CloneComponent} from "./clone/clone.component";


const routes: Routes = [
  {path: 'patientenliste', component: PatientenlisteComponent},
  {path: 'add-patient-formular', component: AddPatientFormularComponent},
  {path: 'home', component: HomeComponent},
  {path: 'audittrail', component: AudittrailComponent},
  {path: 'idcard', component: IdcardComponent},
  {path: 'clone', component: CloneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[PatientenlisteComponent, AddPatientFormularComponent, HomeComponent, AudittrailComponent, IdcardComponent, CloneComponent]
