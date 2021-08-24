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
import {IonIcon} from "ionicons/components/ion-icon";
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import {AddPatientFormularComponent} from "./add-patient-formular/add-patient-formular.component";
import {PatientenlisteComponent} from "./patientenliste/patientenliste.component";
import { CloneComponent } from './clone/clone.component';



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
    CloneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
