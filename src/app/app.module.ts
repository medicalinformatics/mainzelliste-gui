import {
  EnvironmentProviders,
  ErrorHandler,
  inject,
  NgModule,
  provideAppInitializer
} from '@angular/core';
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
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AppConfigService} from "./app-config.service";
import {ErrorComponent} from './error/error.component';
import {LogoutComponent} from './logout/logout.component';
import {
  AutoRefreshTokenService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor,
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEvent,
  KeycloakEventType,
  provideKeycloak,
  ReadyArgs,
  typeEventArgs,
  UserActivityService,
  withAutoRefreshToken
} from "keycloak-angular";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {GlobalErrorHandler} from "./error/global-error-handler";
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
  MAT_LUXON_DATE_FORMATS
} from "@angular/material-luxon-adapter";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {first, firstValueFrom, Observable} from "rxjs";
import {NewIdDialog} from './idcard/dialogs/new-id-dialog';
import {FileSaverModule} from 'ngx-filesaver';
import {SharedModule} from "./shared/shared.module";
import {ConsentModule} from "./consent/consent.module";
import {MainLayoutModule} from "./main-layout/main-layout.module";
import {PatientModule} from "./patient/patient.module";
import {DirtyErrorStateMatcher} from "./patient/patient-fields/patient-fields.component";
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {AccessDeniedComponent} from './access-denied/access-denied.component';
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
  ExportPatientsDialogComponent
} from './patientlist/dialogs/export-patients-dialog/export-patients-dialog.component';
import {MatListModule} from "@angular/material/list";
import {
  ValidRelatedExternalIdsDirective
} from "./shared/directives/valid-related-external-ids.directive";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {BackendConfigService} from "./services/backend-config.service";
import {AuthorizationService} from "./services/authorization.service";
import {AppConfig} from "./app-config";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, map} from "rxjs/operators";

export async function initializeAppFactory(
  appConfigService: AppConfigService,
  backendConfigService: BackendConfigService,
  keycloakSignalObservable: Observable<KeycloakEvent>,
  authorizationService: AuthorizationService,
  translate: TranslateService,
  localStorageService: LocalStorageService
): Promise<any> {
  // read ui config file and init translate service
  return appConfigService.init().then( c => {
    translate.addLangs(['en-US', 'de-DE']);
    translate.setFallbackLang(appConfigService.getDefaultLanguage());
    return firstValueFrom(translate.use(localStorageService.language));
  }).then( () =>
    // check if keycloak event changed its state to 'ready'
    firstValueFrom(keycloakSignalObservable.pipe(
    filter(e => e.type == KeycloakEventType.Ready),
    map(evt => typeEventArgs<ReadyArgs>(evt.args)),
    first()
  )))
  .then(isLoggedIn => {
    //fetch backend configuration
    if (isLoggedIn)
      return backendConfigService.init().then(d => authorizationService.init())
    else
      return Promise.resolve();
  })
}

export function provideKeycloakWithConfig(): EnvironmentProviders {
  console.log("start provideKeycloakWithConfig")
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/assets/config/config.json', false);
  xhr.send(null);
  const config: AppConfig = JSON.parse(xhr.responseText);
  return provideKeycloak({
    config: {
      url: config.patientLists[0].oAuthConfig?.url ?? "",
      realm: config.patientLists[0].oAuthConfig?.realm ?? "",
      clientId: config.patientLists[0].oAuthConfig?.clientId ?? ""
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      // redirectUri: window.location.origin + '/'
    },
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [{
          urlPattern: /^.+\/(configuration|sessions).*$/,
        }]
      }
    ],
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000
      })
    ]
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
    ExportPatientsDialogComponent
  ],
  bootstrap: [AppComponent], imports: [SharedModule,
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
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule,
    ConsentModule,
    ConfigurationModule,
    FileSaverModule,
    MatStepperModule,
    EditorModule,
    MatListModule,
    ValidRelatedExternalIdsDirective],
  providers: [
    {provide: MatPaginatorIntl, useClass: InternationalizedMatPaginatorIntl},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "./assets/i18n/",
        suffix: ".json"
      }),
      fallbackLang: "en-US",
      lang: "en-US"
    }),
    provideKeycloakWithConfig(),
    provideAppInitializer(async () =>
      initializeAppFactory(
        inject(AppConfigService),
        inject(BackendConfigService),
        toObservable(inject(KEYCLOAK_EVENT_SIGNAL)),
        inject(AuthorizationService),
        inject(TranslateService),
        inject(LocalStorageService))
    ),
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: ErrorStateMatcher, useClass: DirtyErrorStateMatcher},
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS},
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS]
    },
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  ]
})

export class AppModule {
}
