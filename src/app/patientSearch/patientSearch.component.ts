import {Component, Input, OnInit} from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {add} from "ionicons/icons";

@Component({
  selector: 'app-patient-search',
  templateUrl: './patientSearch.component.html',
  styleUrls: ['./patientSearch.component.css']
})
export class PatientSearchComponent implements OnInit {

  patientService: PatientService;
  patients: Array<Patient> = [];

  @Input() patient: Patient = new Patient()
  @Input() fields : Array<string> = [];

//Test
  selectedFilter: Array<string>=[];

  filterOptions: Array<string>=["gleich", "nicht gleich", "Beginnt mit", "Endet mit", "Enthält", "Enthält nicht"];
  title="Filter";
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  constructor(public dialogRef: MatDialogRef<PatientSearchComponent>,patientService: PatientService) {
    this.patientService = patientService;

  }
  ngOnInit(): void {

  }

  closeFilter(){
    console.log("closedFilter");
    this.dialogRef.close();
  }

  updatePatientlist(){
  }
}
