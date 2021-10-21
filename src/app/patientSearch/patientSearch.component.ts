import { Component, OnInit } from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-patient-search',
  templateUrl: './patientSearch.component.html',
  styleUrls: ['./patientSearch.component.css']
})
export class PatientSearchComponent implements OnInit {
  title="Filter";
  filterOptions: Array<string>=["gleich", "nicht gleich", "Bgeinnt mit", "Endet mit", "Enthält", "Enthält nicht"];

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(public dialogRef: MatDialogRef<PatientSearchComponent>) { }
  ngOnInit(): void {
  }

  closeFilter(){
    console.log("closedFilter");
    this.dialogRef.close();
  }
}
