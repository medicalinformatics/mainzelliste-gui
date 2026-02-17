import {
  enableProdMode,
  EnvironmentProviders,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer
} from '@angular/core';

import {environment} from './environments/environment';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {
  InternationalizedMatPaginatorIntl
} from './app/shared/components/paginator/internationalized-mat-paginator-intl';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppConfig} from './app/app-config';
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
} from 'keycloak-angular';
import {AppConfigService} from './app/app-config.service';
import {BackendConfigService} from './app/services/backend-config.service';
import {AuthorizationService} from './app/services/authorization.service';
import {LocalStorageService} from './app/services/local-storage.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {GlobalErrorHandler} from './app/error/global-error-handler';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from '@angular/material/core';
import {DirtyErrorStateMatcher} from './app/patient/patient-fields/patient-fields.component';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
  MAT_LUXON_DATE_FORMATS
} from '@angular/material-luxon-adapter';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {ConsentModule} from './app/consent/consent.module';
import {FileSaverModule} from 'ngx-filesaver';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list';
import {AppComponent} from './app/app.component';
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing.module";
import {first, firstValueFrom, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";

if (environment.production) {
  enableProdMode();
}

export async function initializeAppFactory(
  appConfigService: AppConfigService,
  backendConfigService: BackendConfigService,
  keycloakSignalObservable: Observable<KeycloakEvent>,
  authorizationService: AuthorizationService,
  translate: TranslateService,
  localStorageService: LocalStorageService
): Promise<any> {
  // read ui config file and init translate service
  return appConfigService.init().then(c => {
    translate.addLangs(['en-US', 'de-DE']);
    translate.setFallbackLang(appConfigService.getDefaultLanguage());
    return firstValueFrom(translate.use(localStorageService.language));
  }).then(() =>
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

export function provideKeycloakWithConfig(config: AppConfig): EnvironmentProviders {
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

const init = async () => {
  const config: AppConfig = await fetch('/assets/config/config.json').then((res) => res?.json());
  await bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, FormsModule, ScrollingModule, MatSidenavModule, MatBadgeModule, MatPaginatorModule, MatNativeDateModule, MatTableModule, MatCheckboxModule, MatTooltipModule, MatProgressSpinnerModule, MatProgressBarModule, ClipboardModule, ConsentModule, FileSaverModule, MatStepperModule, EditorModule, MatListModule),
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
      provideKeycloakWithConfig(config),
      provideAppInitializer(async () => initializeAppFactory(inject(AppConfigService), inject(BackendConfigService), toObservable(inject(KEYCLOAK_EVENT_SIGNAL)), inject(AuthorizationService), inject(TranslateService), inject(LocalStorageService))),
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
      provideRouter(routes),
      provideAnimations()
    ]
  })
};

init().catch((error) => console.error(`Failed to initialize Mainzelliste UI. ${error.message || error}`));
