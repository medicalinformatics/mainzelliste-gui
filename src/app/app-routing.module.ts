import {NgModule} from '@angular/core';
import{ Routes, RouterModule} from '@angular/router';
import {AddPatientFormularComponent} from "./add-patient-formular/add-patient-formular.component";
import {PatientenlisteComponent} from "./patientenliste/patientenliste.component";

const routes: Routes = [
  {path: 'patientenliste', component: PatientenlisteComponent},
  {path: 'add-patient-formular', component: AddPatientFormularComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}
export const routingComponents =[PatientenlisteComponent, AddPatientFormularComponent]
