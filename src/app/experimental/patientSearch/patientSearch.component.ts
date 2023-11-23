import {Component, Inject, Injectable, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PatientService} from "../../services/patient.service";

@Component({
  selector: 'app-patient-search',
  templateUrl: './patientSearch.component.html',
  styleUrls: ['./patientSearch.component.css']
})

export class PatientSearchComponent implements OnInit {

  filterOptions: Array<string> = ["gleich", "nicht gleich", "Beginnt mit", "Endet mit", "Enthält", "Enthält nicht"];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  constructor(@Inject(MAT_DIALOG_DATA) public data: PatientService, public dialogRef: MatDialogRef<PatientSearchComponent>) {

  }

  ngOnInit(): void {

  }


  save(){
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
