import { Component, OnInit } from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-patient-search',
  templateUrl: './patientSearch.component.html',
  styleUrls: ['./patientSearch.component.css']
})
export class PatientSearchComponent implements OnInit {
  title="Filter";

  constructor(public dialogRef: MatDialogRef<PatientSearchComponent>) { }
  ngOnInit(): void {
  }

  closeFilter(){
    console.log("closedFilter");
    this.dialogRef.close();
  }
}
