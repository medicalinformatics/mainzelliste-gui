import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";

const routes = [
    {path: 'patient/:idType/:idString/add-consent', component: AddConsentComponent, data: {permission: 'addConsent'}},
    // TODO support multiple permissions 'readConsent'
    {path: 'patient/:idType/:idString/edit-consent/:id', component: EditConsentComponent, data: {permission: 'editConsent'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsentRoutingModule {
}
