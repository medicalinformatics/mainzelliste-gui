import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {IdGeneratorsComponent} from './idgenerator/id-generators/id-generators.component';
import {
  IdGeneratorDialogComponent
} from './idgenerator/id-generator-dialog/id-generator-dialog.component';
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyProgressBarModule as MatProgressBarModule} from "@angular/material/legacy-progress-bar";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import { IdGeneratorDetailComponent } from './idgenerator/id-generator-detail/id-generator-detail.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import { PoliciesComponent } from './policies/policies.component';
import { PolicyDialogComponent } from './policy-dialog/policy-dialog.component';
import { PolicySetFormComponent } from './policy-set-form/policy-set-form.component';
import { PolicyFormComponent } from './policy-form/policy-form.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClipboardModule,
    RouterModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    MatTableModule,
    MatTabsModule
  ],
  declarations: [
    IdGeneratorsComponent,
    IdGeneratorDialogComponent,
    IdGeneratorDetailComponent,
    ConfigurationComponent,
    PoliciesComponent,
    PolicyDialogComponent,
    PolicySetFormComponent,
    PolicyFormComponent
  ]
})
export class ConfigurationModule {
}
