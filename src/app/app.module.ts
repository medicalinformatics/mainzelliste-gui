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
import {from} from "rxjs";
import {UserAuthService} from "./services/user-auth.service";
import {NewIdDialog} from './idcard/dialogs/new-id-dialog';
import {SharedModule} from "./shared/shared.module";
import {ConsentModule} from "./consent/consent.module";
import {MainLayoutModule} from "./main-layout/main-layout.module";
import {PatientModule} from "./patient/patient.module";
import {DirtyErrorStateMatcher} from "./patient/patient-fields/patient-fields.component";
import {TranslateService} from '@ngx-translate/core';
import {AccessDeniedComponent} from './access-denied/access-denied.component';
import {InternationalizedMatPaginatorIntl} from "./shared/components/paginator/internationalized-mat-paginator-intl";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ConsentTemplatesComponent} from './consent/consent-templates/consent-templates.component';
import { TentativeMatchesListComponent } from './experimental/tentative-matches-list/tentative-matches-list.component';
import { MergeSplitPatientComponent } from './experimental/merge-split-patient/merge-split-patient.component';

function initializeAppFactory(configService: AppConfigService, keycloak: KeycloakService,
                              userAuthService: UserAuthService, translate: TranslateService): () => Promise<any> {
  translate.addLangs(['en-US', 'de-DE']);
  return () => configService.init()
    .then(config => {
      from(keycloak.keycloakEvents$).subscribe(event => userAuthService.notifyKeycloakEvent(event));
      translate.setDefaultLang(config[0].defaultLanguage || "en-US");
      return translate.use(translate.getDefaultLang()).toPromise()
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
    TentativeMatchesListComponent,
    MergeSplitPatientComponent,
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
    ConsentModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: InternationalizedMatPaginatorIntl},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppConfigService, KeycloakService, UserAuthService, TranslateService],
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
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
