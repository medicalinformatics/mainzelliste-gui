import { Component, OnInit } from '@angular/core';
import { AdventureTimeService } from '../adventure-time.service';
import {Observable} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterComponent} from "../filter/filter.component";


@Component({
  selector: 'app-patientenliste',
  templateUrl: './patientenliste.component.html',
  styleUrls: ['./patientenliste.component.css']
})


export class PatientenlisteComponent implements OnInit {
  title="Patientenliste";
 /* characters: Observable<any[]> | undefined;
  columns: string[] | undefined;*/
  patientenzeile= "<PaientenZeileComponent>";

  constructor(public dialog: MatDialog ) {

  }

  ngOnInit() {/*
    this.columns = this.atService.getColumns();
    //["name", "age", "species", "occupation"]
    this.characters = this.atService.getCharacters();
    //all data in mock-data.ts*/
  }

  openfilterpseudonyme(){
  console.log("opened pseudonymFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfilternachname(){
    console.log("opened nachnameFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfiltergeburtsname(){
    console.log("opened geburtsnameFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfiltervorname(){
    console.log("opened vornameFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfiltergeburtsdatum(){
    console.log("opened geburtsdatumFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfilterwohnort(){
    console.log("opened wohnortFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }
  openfilterplz(){
    console.log("opened plzFilter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }



}
