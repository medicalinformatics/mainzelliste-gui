import { NgModule } from '@angular/core';
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
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import { PatientComponent } from './patient/patient.component';
import {MatButtonModule} from "@angular/material/button";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { PatientlistViewComponent } from './patientlist-view/patientlist-view.component';
import { HistorieComponent } from './historie/historie.component';



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
    CreatePatientComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        ScrollingModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
