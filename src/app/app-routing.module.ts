import {NgModule} from '@angular/core';
import{ Routes, RouterModule} from '@angular/router';
import {AddPatientFormularComponent} from "./add-patient-formular/add-patient-formular.component";
import {PatientenlisteComponent} from "./patientenliste/patientenliste.component";
import {HomeComponent} from "./home/home.component";
import {AudittrailComponent} from "./audittrail/audittrail.component";
import {IdcardComponent} from "./idcard/idcard.component";
import {CloneComponent} from "./clone/clone.component";
import {ZusammenfuehrenComponent} from "./zusammenfuehren/zusammenfuehren.component";
import {ErgebnisZusammenfuehrenComponent} from "./ergebnis-zusammenfuehren/ergebnis-zusammenfuehren.component";
import {PatientAngelegtComponent} from "./patient-angelegt/patient-angelegt.component";

const routes: Routes = [
  {path: 'patientenliste', component: PatientenlisteComponent},
  {path: 'add-patient-formular', component: AddPatientFormularComponent},
  {path: 'home', component: HomeComponent},
  {path: 'audittrail', component: AudittrailComponent},
  {path: 'idcard', component: IdcardComponent},
  {path: 'clone', component: CloneComponent},
  {path: 'zusammenfuehren', component: ZusammenfuehrenComponent},
  {path: 'ergebnis-zusammenfuehren', component: ErgebnisZusammenfuehrenComponent},
  {path: 'patientangelegt', component: PatientAngelegtComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[PatientenlisteComponent, AddPatientFormularComponent, HomeComponent, AudittrailComponent, IdcardComponent, CloneComponent, ZusammenfuehrenComponent, ErgebnisZusammenfuehrenComponent, PatientAngelegtComponent]
