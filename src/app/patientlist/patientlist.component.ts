import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PatientSearchComponent} from "../patientSearch/patientSearch.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {PatientrowComponent} from "../patientrow/patientrow.component";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})

export class PatientlistComponent {
  title = "Patientenliste";
  patientService: PatientService;
  patients: Patient[] = [];
  selection: SelectionModel<Patient>;

  tmpPatient: Patient = new Patient();
  fields: string[] = ["Nachname", "Geburtsname", "Vorname", "Geburtsdatum", "Wohnort", "PLZ"];
  filterChoice: Array<string>=[];

  @Output() selectedP = new EventEmitter<PatientlistComponent>();
  selectedPatients: Array<Patient> = [];
  columns: string[] = ["select"];

  constructor(public dialog: MatDialog, patientService: PatientService) {
    this.columns = this.columns.concat(this.fields);
    this.patientService = patientService;
    this.patients = this.patientService.patients;

    const initialSelection: Patient[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Patient>(allowMultiSelect, initialSelection);
  }

  openfilter(spalte: string) {
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'pseudonymfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '11%'}});
    } else if (spalte == 'nachnamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '21%'}});
    } else if (spalte == 'geburtsnamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '31%'}});
    } else if (spalte == 'vornamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '41%'}});
    } else if (spalte == 'geburtsdatumfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '53%'}});
    } else if (spalte == 'wohnortfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '63%'}});
    } else if (spalte == 'plzfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '75%'}});
    }
  }

  erstelleNeuenPatienten () {
    this.patientService.createPatient(this.tmpPatient).then((result) => {
      if (result == 200) {
        this.tmpPatient = new Patient();
      }
    });
  }

  useFilter(filterWahl:string){
    this.filterChoice.push(filterWahl);
  }

  patientSelected(row: PatientrowComponent){
    console.log(row.selected);
    if (row.selected) {
     this.selectedPatients.push(row.patient);
   }
   else{
     let index = this.selectedPatients.findIndex((patientFromArray)=>{
       return patientFromArray.ids[0].idString===row.patient.ids[0].idString;
     });
     if (index > -1) {
       this.selectedPatients.splice(index, 1);
     }
   }
    this.selectedP.emit(this);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.patients.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.patients.forEach(row => this.selection.select(row));
  }
}
