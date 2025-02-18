import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
// import {AudittrailComponent} from './audittrail/audittrail.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {IdcardComponent} from './idcard/idcard.component';
import {PatientlistComponent} from "./patientlist/patientlist.component";
// import {SimilarPatientComponent} from './similarPatient/similarPatient.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PatientlistViewComponent} from './patientlist-view/patientlist-view.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatBadgeModule} from "@angular/material/badge";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from '@angular/material/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AppConfigService} from "./app-config.service";
import {ErrorComponent} from './error/error.component';
import {LogoutComponent} from './logout/logout.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {GlobalErrorHandler} from "./error/global-error-handler";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {firstValueFrom, from} from "rxjs";
import {UserAuthService} from "./services/user-auth.service";
import {NewIdDialog} from './idcard/dialogs/new-id-dialog';
import {NgxCsvParserModule} from 'ngx-csv-parser';
import {FileSaverModule} from 'ngx-filesaver';
import {SharedModule} from "./shared/shared.module";
import {ConsentModule} from "./consent/consent.module";
import {MainLayoutModule} from "./main-layout/main-layout.module";
import {PatientModule} from "./patient/patient.module";
import {DirtyErrorStateMatcher} from "./patient/patient-fields/patient-fields.component";
import {TranslateService} from '@ngx-translate/core';
import {AccessDeniedComponent} from './access-denied/access-denied.component';
import {NgxMatFileInputModule} from '@angular-material-components/file-input';
import {MatStepperModule} from '@angular/material/stepper';
import {
  InternationalizedMatPaginatorIntl
} from "./shared/components/paginator/internationalized-mat-paginator-intl";
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ConsentTemplatesComponent} from './consent/consent-templates/consent-templates.component';
import {ConfigurationModule} from "./configuration/configuration.module";
import {LocalStorageService} from "./services/local-storage.service";
import {
  BulkIdGenerationComponent
} from "./bulk-operations/bulk-id-generation/bulk-id-generation.component";
import {
  BulkIdGenerationTableComponent
} from "./bulk-operations/bulk-id-generation/table/bulk-id-generation-table.component";
import {
  BulkIdGenerationEmptyFieldsDialog
} from "./bulk-operations/bulk-id-generation/dialog/bulk-id-generation-empty-fields-dialog";
import {
  BulkPseudonymizationComponent
} from './bulk-operations/bulk-pseudonymization/bulk-pseudonymization.component';
import {EditorModule, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {
  TentativeMatchesListComponent
} from "./tentative-matches/tentative-matches-list/tentative-matches-list.component";
import {
  SolveTentativeMatchComponent
} from "./tentative-matches/solve-tentative-match/solve-tentative-match.component";
import {
  MergeTentativeMatchDialogComponent
} from "./tentative-matches/solve-tentative-match/dialog/merge-tentative-match-dialog.component";
import { MatListModule } from '@angular/material/list';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';

function initializeAppFactory(
    configService: AppConfigService,
    keycloak: KeycloakService,
    userAuthService: UserAuthService,
    translate: TranslateService,
    localStorageService :LocalStorageService
): () => Promise<any> {
  translate.addLangs(['en-US', 'de-DE']);
  return () => configService.init()
    .then(config => {
      from(keycloak.keycloakEvents$).subscribe(event => userAuthService.notifyKeycloakEvent(event));
      translate.setDefaultLang(config[0].defaultLanguage || "en-US");
      return firstValueFrom(translate.use(localStorageService.language))
        .then(() => keycloak.init({
          config: {
            url: config[0].oAuthConfig?.url ?? "",
            realm: config[0].oAuthConfig?.realm ?? "",
            clientId: config[0].oAuthConfig?.clientId ?? ""
          },
          loadUserProfileAtStartUp: true,
          initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri:
              window.location.origin + '/assets/silent-check-sso.html'
          },
          shouldAddToken: (request) => {
            const paths = ['/sessions', '/configuration'];
            return paths.some((path) => request.url.includes(path));
          }
        }).catch(error => {
          // find error reason
          let reason = "";
          if (error) {
            reason = error.error?.length > 0 ? " Reason: " + error.error : "";
          }
          throw new Error(translate.instant('error.app_module_connect_keycloak') + reason);
        }))
        .then(isLoggedIn => isLoggedIn ? configService.fetchMainzellisteIdGenerators() : undefined)
        .then(idGenerators => idGenerators != undefined ? configService.fetchMainzellisteAssociatedIdGenerators() : undefined)
        .then(idGenerators => idGenerators != undefined ? configService.fetchMainzellisteFields() : undefined)
        .then(fields => fields != undefined ? configService.fetchClaims() : undefined)
        .then(claims => configService.fetchVersion());
    });
}

@NgModule({
  declarations: [
    AppComponent,
    PatientlistComponent,
    routingComponents,
    IdcardComponent,
    PatientlistViewComponent,
    ErrorComponent,
    LogoutComponent,
    NewIdDialog,
    AccessDeniedComponent,
    PageNotFoundComponent,
    ConsentTemplatesComponent,
    BulkIdGenerationComponent,
    BulkIdGenerationTableComponent,
    BulkIdGenerationEmptyFieldsDialog,
    BulkPseudonymizationComponent,
    ConsentTemplatesComponent,
    TentativeMatchesListComponent,
    SolveTentativeMatchComponent,
    MergeTentativeMatchDialogComponent
  ],
  imports: [
    SharedModule,
    MainLayoutModule,
    PatientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ScrollingModule,
    MatSidenavModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    HttpClientModule,
    KeycloakAngularModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule,
    ConsentModule,
    ConfigurationModule,
    NgxCsvParserModule,
    FileSaverModule,
    NgxMatFileInputModule,
    MatStepperModule,
    EditorModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: InternationalizedMatPaginatorIntl},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppConfigService, KeycloakService, UserAuthService, TranslateService, LocalStorageService],
      multi: true
    },
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: ErrorStateMatcher, useClass: DirtyErrorStateMatcher},
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
