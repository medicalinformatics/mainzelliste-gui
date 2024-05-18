import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConsentDetailComponent} from "./consent-detail/consent-detail.component";
import {ConsentDialogComponent} from "./consent-dialog/consent-dialog.component";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {
  EditConsentComponent
} from "./edit-consent/edit-consent.component";
import {SharedModule} from "../shared/shared.module";
import {ConsentService} from "./consent.service";
import {ConsentRejectedDialog} from "./dialog/consent-rejected-dialog";
import {ConsentInactivatedDialog} from "./dialog/consent-inactivated-dialog";


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ConsentDetailComponent, ConsentDialogComponent, AddConsentComponent, EditConsentComponent,
    ConsentRejectedDialog, ConsentInactivatedDialog],
  providers: [ConsentService]
})
export class ConsentModule {
}
