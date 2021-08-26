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


  constructor(public dialog: MatDialog ) {


  }

  ngOnInit() {/*
    this.columns = this.atService.getColumns();
    //["name", "age", "species", "occupation"]
    this.characters = this.atService.getCharacters();
    //all data in mock-data.ts*/
  }

  openfilter(){
  console.log("halloo");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(FilterComponent);
  }


}
