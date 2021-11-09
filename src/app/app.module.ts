import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AudittrailComponent } from './audittrail/audittrail.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PatientrowComponent } from './patientrow/patientrow.component';
import { HeadComponent } from './head/head.component';
import { PatientSearchComponent } from './patientSearch/patientSearch.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import { IdcardComponent } from './idcard/idcard.component';
import { IonicModule } from '@ionic/angular';
import { FooterComponent }from './footer/footer.component';
import {CreatePatientComponent} from "./createPatient/createPatient.component";
import {PatientlistComponent} from "./patientlist/patientlist.component";
import { SimilarPatientComponent } from './similarPatient/similarPatient.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { UserComponent } from './user/user.component';
import {HttpClientModule} from "@angular/common/http";
import {PatientListService} from "./services/patient-list.service";
import {ConfigurationService} from "./services/configuration.service";
import {UserService} from "./services/user.service";


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
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
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
    HttpClientModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {
      provide: APP_INITIALIZER,
      multi : true,
      deps : [ConfigurationService],
      useFactory : (configService: ConfigurationService) =>  () => {
        configService.loadConfig()
      }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
