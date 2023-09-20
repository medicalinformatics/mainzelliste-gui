import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AudittrailComponent} from './audittrail/audittrail.component';
import {NavigationComponent} from './navigation/navigation.component';
import {HeadComponent} from './head/head.component';
import {PatientSearchComponent} from './patientSearch/patientSearch.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {IdcardComponent} from './idcard/idcard.component';
import {FooterComponent} from './footer/footer.component';
import {
  CreatePatientComponent,
  CreatePatientTentativeDialog
} from "./createPatient/createPatient.component";
import {PatientlistComponent} from "./patientlist/patientlist.component";
import {SimilarPatientComponent} from './similarPatient/similarPatient.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {PatientComponent} from './patient/patient.component';
import {MatButtonModule} from "@angular/material/button";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PatientlistViewComponent} from './patientlist-view/patientlist-view.component';
import {HistorieComponent} from './historie/historie.component';
import {
  DirtyErrorStateMatcher,
  PatientFieldsComponent
} from './patient-fields/patient-fields.component';
import {MatInputModule} from "@angular/material/input";
import {
  EditPatientComponent,
  EditPatientTentativeDialog
} from './edit-patient/edit-patient.component';
import {
  DeletePatientComponent,
  DeletePatientDialog
} from './delete-patient/delete-patient.component';
import {PatientPseudonymsComponent} from './patient-pseudonyms/patient-pseudonyms.component';
import {PatientDataComponent} from './patient-data/patient-data.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatBadgeModule} from "@angular/material/badge";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {
  DeleteMultiplePatientsComponent
} from './delete-multiple-patients/delete-multiple-patients.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from '@angular/material/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SessionComponent} from './user/session.component';
import {HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AppConfigService} from "./app-config.service";
import {ErrorComponent} from './error/error.component';
import {MatMenuModule} from "@angular/material/menu";
import {LogoutComponent} from './logout/logout.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {GlobalErrorHandler} from "./error/global-error-handler";
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';
import {ErrorCardComponent} from './component-error-card/error-card.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {from} from "rxjs";
import {UserAuthService} from "./services/user-auth.service";
import { ExternalPseudonymsComponent } from './shared/external-pseudonyms/external-pseudonyms.component';

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
    AudittrailComponent,
    NavigationComponent,
    PatientlistComponent,
    HeadComponent,
    PatientSearchComponent,
    routingComponents,
    IdcardComponent,
    FooterComponent,
    SimilarPatientComponent,
    PatientComponent,
    PatientlistViewComponent,
    HistorieComponent,
    CreatePatientComponent,
    PatientFieldsComponent,
    EditPatientComponent,
    DeletePatientComponent,
    PatientPseudonymsComponent,
    PatientDataComponent,
    DeleteMultiplePatientsComponent,
    SessionComponent,
    ErrorComponent,
    LogoutComponent,
    ErrorDialogComponent,
    ErrorCardComponent,
    DeletePatientDialog,
    CreatePatientTentativeDialog,
    EditPatientTentativeDialog,
    ExternalPseudonymsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ScrollingModule,
    MatSidenavModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatTooltipModule,
    HttpClientModule,
    MatMenuModule,
    KeycloakAngularModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule
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
    bootstrap: [AppComponent]
})

export class AppModule { }
