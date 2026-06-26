import {
  enableProdMode,
  EnvironmentProviders,
  ErrorHandler,
  importProvidersFrom,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
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
import {EMPTY, first, firstValueFrom, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";
import {MlTokenAuthService} from "./app/services/ml-token-auth.service";

if (environment.production) {
  enableProdMode();
}

export class BootState {
  public ready: boolean = false;
}

export const APP_BOOT_STATUS_EVENT_SIGNAL = new InjectionToken<BootState>('app.boot.status', {
  providedIn: 'root',
  factory: () => new BootState(),
});

export async function initializeAppFactory(
  appConfigService: AppConfigService,
  backendConfigService: BackendConfigService,
  keycloakSignalObservable: Observable<KeycloakEvent>,
  authorizationService: AuthorizationService,
  translate: TranslateService,
  dateAdapter: DateAdapter<any>,
  localStorageService: LocalStorageService,
  mlTokenAuthService: MlTokenAuthService,
  bootState: BootState
): Promise<any> {
  // read url parameters
  const params = new URLSearchParams(window.location.search);

  // init config file
  await appConfigService.init();

  // init translation service
  await initTranslationService(appConfigService, translate, localStorageService, dateAdapter, params.get('language') ?? "");

  // read tokenId url parameter
  const tokenId = params.get('tokenId');

  // init authentication service
  const authenticationState = await authenticate(
    tokenId,
    params.get('sessionId'),
    mlTokenAuthService,
    keycloakSignalObservable,
    appConfigService.isOAuthConfigured()
  );

  // init authorization and configuration services
  if(authenticationState != AuthenticationState.FAILED) {
    await backendConfigService.init(authenticationState == AuthenticationState.SUCCESS_WITH_ML_TOKEN? tokenId : null);
    authorizationService.init(authenticationState == AuthenticationState.SUCCESS_WITH_OAUTH);
  }

  bootState.ready = true;
}

const initTranslationService = async (
  appConfigService: AppConfigService,
  translate: TranslateService,
  localStorageService: LocalStorageService,
  dateAdapter: DateAdapter<any>,
  langCodeParam: string
)=> {
  const availableLangCodes = ['en-US', 'de-DE'];

  // override local storage language with language code given by the url parameter
  const langCode = availableLangCodes.find( l => langCodeParam && l.startsWith(langCodeParam)) ?? localStorageService.language;

  // init translate service
  translate.addLangs(availableLangCodes);
  translate.setFallbackLang(appConfigService.getDefaultLanguage());
  dateAdapter.setLocale(langCode);
  return firstValueFrom(translate.use(langCode));
}

enum AuthenticationState { SUCCESS_WITH_ML_TOKEN, SUCCESS_WITH_OAUTH, FAILED}

async function authenticate(
  tokenId: string | null,
  sessionId: string | null,
  mlTokenAuthService: MlTokenAuthService,
  keycloakSignalObservable: Observable<KeycloakEvent>,
  isOAuthConfigured: boolean
) {
  // try to authenticate with mainzelliste token
  if (await mlTokenAuthService.init(sessionId, tokenId)) {
    return AuthenticationState.SUCCESS_WITH_ML_TOKEN;
  } else if (isOAuthConfigured && await checkKeycloakAuthenticationStatus(keycloakSignalObservable)) {
    return AuthenticationState.SUCCESS_WITH_OAUTH;
  } else {
    return AuthenticationState.FAILED;
  }
}

// check if keycloak event changed its state to 'ready'
function checkKeycloakAuthenticationStatus(keycloakSignalObservable: Observable<KeycloakEvent>){
  return firstValueFrom(keycloakSignalObservable.pipe(
    filter(e => e.type == KeycloakEventType.Ready),
    map(evt => typeEventArgs<ReadyArgs>(evt.args)),
    first()
  ))
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
  const isOAuthConfigured = config.patientLists[0].oAuthConfig != undefined;
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
      isOAuthConfigured ? provideKeycloakWithConfig(config) : makeEnvironmentProviders([]),
      provideAppInitializer(async () => initializeAppFactory(inject(AppConfigService), inject(BackendConfigService),  isOAuthConfigured ? toObservable(inject(KEYCLOAK_EVENT_SIGNAL)) : EMPTY, inject(AuthorizationService), inject(TranslateService), inject(DateAdapter), inject(LocalStorageService), inject(MlTokenAuthService), inject(APP_BOOT_STATUS_EVENT_SIGNAL))),
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
      provideHttpClient(withInterceptors(isOAuthConfigured ? [includeBearerTokenInterceptor] : [])),
      provideRouter(routes),
      provideAnimations()
    ]
  })
};

init().catch((error) => console.error(`Failed to initialize Mainzelliste UI. ${error.message || error}`));
