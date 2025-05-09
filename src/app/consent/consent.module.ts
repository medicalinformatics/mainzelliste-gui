import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConsentDetailComponent} from "./consent-detail/consent-detail.component";
import {ConsentDialogComponent} from "./consent-dialog/consent-dialog.component";
import {AddConsentComponent} from "./add-consent/add-consent.component";
import {EditConsentComponent} from "./edit-consent/edit-consent.component";
import {SharedModule} from "../shared/shared.module";
import {ConsentService} from "./consent.service";
import {ConsentRejectedDialog} from "./dialogs/consent-rejected-dialog";
import {ConsentInactivatedDialog} from "./dialogs/consent-inactivated-dialog";
import {
  ConsentTemplateDialogComponent
} from './consent-template-dialog/consent-template-dialog.component';
import {
  ConsentTemplateDetailComponent
} from './consent-template-detail/consent-template-detail.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  ConsentTemplateValidityPeriodDialog
} from "./consent-template-detail/consent-template-validity-period-dialog";
import {
  ConsentTemplateModulesComponent
} from "./consent-template-detail/consent-template-modules.component";
import {MatDividerModule} from "@angular/material/divider";
import {InvalidConsentPeriodDirective} from "../shared/directives/invalid-consent-period.directive";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {
  ConsentHistoryDialogComponent
} from "./consent-history-dialog/consent-history-dialog.component";
import {MatTableModule} from "@angular/material/table";
import {
  ConsentTemplatePolicyDialog
} from "./consent-template-detail/consent-template-policy-dialog";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {
  EmptyConsentTemplateValidityPeriodDirective
} from "../shared/directives/empty-consent-template-validity-period.directive";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    InvalidConsentPeriodDirective,
    MatProgressBarModule,
    MatTableModule,
    EditorComponent,
    EmptyConsentTemplateValidityPeriodDirective
  ],
  declarations: [
    ConsentDetailComponent,
    ConsentDialogComponent,
    ConsentHistoryDialogComponent,
    AddConsentComponent,
    EditConsentComponent,
    ConsentRejectedDialog,
    ConsentInactivatedDialog,
    ConsentTemplateValidityPeriodDialog,
    ConsentTemplatePolicyDialog,
    ConsentTemplateDialogComponent,
    ConsentTemplateDetailComponent,
    ConsentTemplateModulesComponent
  ],
  providers: [ConsentService]
})
export class ConsentModule {
}
