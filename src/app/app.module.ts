import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AudittrailComponent } from './audittrail/audittrail.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PatientrowComponent } from './patientrow/patientrow.component';
import { HeadComponent } from './head/head.component';
import { PatientSearchComponent } from './patientSearch/patientSearch.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import { IdcardComponent } from './idcard/idcard.component';
import { FooterComponent }from './footer/footer.component';
import {CreatePatientComponent} from "./createPatient/createPatient.component";
import {PatientlistComponent} from "./patientlist/patientlist.component";
import { SimilarPatientComponent } from './similarPatient/similarPatient.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import { PatientComponent } from './patient/patient.component';
import {MatButtonModule} from "@angular/material/button";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { PatientlistViewComponent } from './patientlist-view/patientlist-view.component';
import { HistorieComponent } from './historie/historie.component';
import { PatientFieldsComponent } from './patient-fields/patient-fields.component';
import {MatInputModule} from "@angular/material/input";
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { DeletePatientComponent } from './delete-patient/delete-patient.component';
import { PatientPseudonymsComponent } from './patient-pseudonyms/patient-pseudonyms.component';
import { PatientDataComponent } from './patient-data/patient-data.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatBadgeModule} from "@angular/material/badge";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import { DeleteMultiplePatientsComponent } from './delete-multiple-patients/delete-multiple-patients.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { SessionComponent } from './user/session.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AppConfigService} from "./app-config.service";
import { ErrorComponent } from './error/error.component';
import {MatMenuModule} from "@angular/material/menu";
import { LogoutComponent } from './logout/logout.component';
import { ConsentComponent } from './consent/consent.component';
import {DemoMaterialModule} from "./patientlist/material-module";

function initializeAppFactory(service:AppConfigService, httpClient: HttpClient): () => Promise<any> {
  return () => service.load();
}

@NgModule({
  declarations: [
    AppComponent,
    AudittrailComponent,
    NavigationComponent,
    PatientlistComponent,
    PatientrowComponent,
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
    ConsentComponent
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
        DemoMaterialModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
        { provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [
                AppConfigService
            ],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
