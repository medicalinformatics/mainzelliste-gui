import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
// import {AudittrailComponent} from './audittrail/audittrail.component';
import {PatientSearchComponent} from './patientSearch/patientSearch.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {IdcardComponent} from './idcard/idcard.component';
import {CreatePatientComponent, CreatePatientTentativeDialog} from "././create-patient/create-patient.component";
import {PatientlistComponent} from "./patientlist/patientlist.component";
// import {SimilarPatientComponent} from './similarPatient/similarPatient.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {PatientComponent} from './patient/patient.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PatientlistViewComponent} from './patientlist-view/patientlist-view.component';
import {DirtyErrorStateMatcher, PatientFieldsComponent} from './patient-fields/patient-fields.component';
import {EditPatientComponent, EditPatientTentativeDialog} from './edit-patient/edit-patient.component';
import {DeletePatientComponent} from './delete-patient/delete-patient.component';
import {PatientPseudonymsComponent} from './patient-pseudonyms/patient-pseudonyms.component';
import {PatientDataComponent} from './patient-data/patient-data.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatBadgeModule} from "@angular/material/badge";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatPaginatorModule} from "@angular/material/paginator";
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
import {ExternalPseudonymsComponent} from './shared/external-pseudonyms/external-pseudonyms.component';
import {DeletePatientDialog} from "./idcard/dialogs/delete-patient-dialog";
import {NewIdDialog} from './idcard/dialogs/new-id-dialog';
import {SharedModule} from "./shared/shared.module";
import {ConsentModule} from "./consent/consent.module";
import {MainLayoutModule} from "./main-layout/main-layout.module";

function initializeAppFactory(configService: AppConfigService, keycloak: KeycloakService, userAuthService: UserAuthService): () => Promise<any> {
  return () => configService.init()
  .then(config => {
    from(keycloak.keycloakEvents$).subscribe( event => userAuthService.notifyKeycloakEvent(event));
    return keycloak.init({
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
      }
    })
    .catch(error => {
      // find error reason
      let reason = "";
      if (error) {
        reason = error.error?.length > 0 ? " Reason: " + error.error : "";
      }
      throw new Error("Failed to connect to Keycloak." + reason);
    })
    .then( isLoggedIn => isLoggedIn ? configService.fetchMainzellisteIdGenerators() : [])
    .then( idGenerators => idGenerators.length > 0? configService.fetchMainzellisteFields() : []);
  });
}

@NgModule({
  declarations: [
    AppComponent,
    PatientlistComponent,
    PatientSearchComponent,
    routingComponents,
    IdcardComponent,
    PatientComponent,
    PatientlistViewComponent,
    CreatePatientComponent,
    PatientFieldsComponent,
    EditPatientComponent,
    DeletePatientComponent,
    PatientPseudonymsComponent,
    PatientDataComponent,
    ErrorComponent,
    LogoutComponent,
    DeletePatientDialog,
    NewIdDialog,
    CreatePatientTentativeDialog,
    EditPatientTentativeDialog,
    ExternalPseudonymsComponent
  ],
  imports: [
    SharedModule,
    MainLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ScrollingModule,
    MatSidenavModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
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
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppConfigService, KeycloakService, UserAuthService],
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
  exports: [
    PatientPseudonymsComponent,
    PatientFieldsComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
