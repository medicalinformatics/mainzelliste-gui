import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {IdGeneratorsComponent} from './idgenerator/id-generators/id-generators.component';
import {
  IdGeneratorDialogComponent
} from './idgenerator/id-generator-dialog/id-generator-dialog.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTableModule} from "@angular/material/table";
import { IdGeneratorDetailComponent } from './idgenerator/id-generator-detail/id-generator-detail.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import {MatTabsModule} from "@angular/material/tabs";
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
