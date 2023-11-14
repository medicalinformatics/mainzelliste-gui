import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CreatePatientComponent} from "./create-patient/create-patient.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";

const routes = [
  {path: 'add-new-patient', component: CreatePatientComponent, data: {permission: 'addPatient'}},
  {path: 'edit-patient/:idType/:idString', component: EditPatientComponent, data: {permission: 'editPatient'}},
  {path: 'delete-patient/:idType/:idString', component: DeletePatientComponent, data: {permission: 'deletePatient'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {
}
