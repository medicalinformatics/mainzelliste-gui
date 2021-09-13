import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AudittrailComponent } from './audittrail/audittrail.component';
import { NavigationsseiteComponent } from './navigationsseite/navigationsseite.component';
import { PatientenzeileComponent } from './patientenzeile/patientenzeile.component';
import { TestComponent } from './test/test.component';
import { HeadComponent } from './head/head.component';
import { FilterComponent } from './filter/filter.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import { IdcardComponent } from './idcard/idcard.component';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import {AddPatientFormularComponent} from "./add-patient-formular/add-patient-formular.component";
import {PatientenlisteComponent} from "./patientenliste/patientenliste.component";
import { CloneComponent } from './clone/clone.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import { EditPatientenZeileComponent } from './edit-patienten-zeile/edit-patienten-zeile.component';
import {FormsModule} from "@angular/forms";
import { ZusammenfuehrenComponent } from './zusammenfuehren/zusammenfuehren.component';
import { ErgebnisZusammenfuehrenComponent } from './ergebnis-zusammenfuehren/ergebnis-zusammenfuehren.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PatientComponent } from './patient/patient.component';
import { PatientAngelegtComponent } from './patient-angelegt/patient-angelegt.component';
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    AppComponent,
    AudittrailComponent,
    NavigationsseiteComponent,
    PatientenlisteComponent,
    PatientenzeileComponent,
    TestComponent,
    HeadComponent,
    FilterComponent,
    AddPatientFormularComponent,
    routingComponents,
    IdcardComponent,
    FooterComponent,
    CloneComponent,
    EditPatientenZeileComponent,
    ZusammenfuehrenComponent,
    ErgebnisZusammenfuehrenComponent,
    PatientComponent,
    PatientAngelegtComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
