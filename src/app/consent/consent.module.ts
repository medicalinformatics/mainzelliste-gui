import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConsentDetailComponent} from "./consent-detail/consent-detail.component";
import {ConsentDialogComponent} from "./consent-dialog/consent-dialog.component";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";
import {ConsentRoutingModule} from './consent-routing.module';
import {SharedModule} from "../shared/shared.module";
import {ConsentService} from "./consent.service";


@NgModule({
  imports: [
    CommonModule,
    ConsentRoutingModule,
    SharedModule
  ],
  declarations: [ConsentDetailComponent, ConsentDialogComponent, AddConsentComponent, EditConsentComponent],
  providers: [ConsentService]
})
export class ConsentModule {
}
