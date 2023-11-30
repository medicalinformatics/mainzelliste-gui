import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";
import {Permission} from "../model/permission";

const routes = [
    {path: 'patient/:idType/:idString/add-consent', component: AddConsentComponent, data: {permission: Permission.CREATE_CONSENT}},
    // TODO support multiple permissions 'readConsent'
    {path: 'patient/:idType/:idString/edit-consent/:id', component: EditConsentComponent, data: {permission: Permission.EDIT_CONSENT}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsentRoutingModule {
}
