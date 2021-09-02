import { Component, OnInit } from '@angular/core';
import { AdventureTimeService } from '../adventure-time.service';
import {Observable} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterComponent} from "../filter/filter.component";


@Component({
  selector: 'app-patientenliste',
  //directives: '[app-edit-patienten-zeile]',
  templateUrl: './patientenliste.component.html',
  styleUrls: ['./patientenliste.component.css']
})


export class PatientenlisteComponent implements OnInit {
  data: Array<any>;
  title="Patientenliste";
 /* characters: Observable<any[]> | undefined;
  columns: string[] | undefined;*/
 // patientenzeile= PaientenZeileComponent;


  constructor(public dialog: MatDialog ) {

    this.data = [
      { pseudonym: 'MKJH56FR', nachname: 'Müller', geburtsname: '', vorname: 'Sara', geburtsdatum: '01.01.2000', wohnort: 'Berlin', plz: '10115' },
      { pseudonym: 'MN321L09', nachname: 'Schmidt', geburtsname: 'Sommer', vorname: 'Laura', geburtsdatum: '19.03.1968', wohnort: 'Hamburg', plz: '20095' },
      { pseudonym: 'ASDKJU11', nachname: 'Frank', geburtsname: '', vorname: 'Tim', geburtsdatum: '15.05.1980', wohnort: 'Hannover', plz: '30159' },
      { pseudonym: 'CQKF88A0', nachname: 'Friedrich', geburtsname: '', vorname: 'Max', geburtsdatum: '23.02.1995', wohnort: 'München', plz: '80331' }
    ];
  }

  ngOnInit() {/*
    this.columns = this.atService.getColumns();
    //["name", "age", "species", "occupation"]
    this.characters = this.atService.getCharacters();
    //all data in mock-data.ts*/
  }

  openfilter(spalte: string) {
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'pseudonymfilter') {
      this.dialog.open(FilterComponent, { position: {top: '0%', left: '0%'}});
    } else if (spalte == 'nachnamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '0%', left: '0%'}});
    } else if (spalte == 'geburtsnamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '31%', left: '48%'}});
    } else if (spalte == 'vornamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '31%', left: '58%'}});
    } else if (spalte == 'geburtsdatumfilter') {
      this.dialog.open(FilterComponent, {position: {top: '31%', left: '68%'}});
    } else if (spalte == 'wohnortfilter') {
      this.dialog.open(FilterComponent, {position: {top: '31%', left: '78%'}});
    } else if (spalte == 'plzfilter') {
      this.dialog.open(FilterComponent, {position: {top: '31%', left: '88%'}});
    }
  }

 /* openfilter(spalte: string){
    console.log("opened nachnameFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
*/


}
