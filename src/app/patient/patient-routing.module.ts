import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CreatePatientComponent} from "./create-patient/create-patient.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {DeletePatientComponent} from "./delete-patient/delete-patient.component";
import {Permission} from "../model/permission";

const routes = [
  {path: 'add-new-patient', component: CreatePatientComponent, data: {permission: Permission.CREATE_PATIENT}},
  {path: 'edit-patient/:idType/:idString', component: EditPatientComponent, data: {permission: Permission.READ_PATIENT}},
  {path: 'delete-patient/:idType/:idString', component: DeletePatientComponent, data: {permission: Permission.DELETE_PATIENT}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {
}
