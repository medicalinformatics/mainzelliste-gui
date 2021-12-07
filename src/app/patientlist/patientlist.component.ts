import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PatientSearchComponent} from "../patientSearch/patientSearch.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PatientlistComponent implements AfterViewInit{
  @Input() patients!: MatTableDataSource<Patient>;
  selection: SelectionModel<Patient>;
  @Output() selectedPatients: EventEmitter<Patient[]> = new EventEmitter<Patient[]>();

  fields: string[] = ["Nachname", "Geburtsname", "Vorname", "Geburtsdatum", "Wohnort", "PLZ"];
  columns: string[] = ["select"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pseudonyms: string[]=["Pseudonym"];

  constructor(public dialog: MatDialog, patientService: PatientService) {
    this.columns = this.columns.concat(this.pseudonyms).concat(this.fields).concat(["actions"]);

    const initialSelection: Patient[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Patient>(allowMultiSelect, initialSelection);
  }

  openFilter(spalte: string) {
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'Pseudonym') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '11%'}, minWidth:"20%",minHeight:"40%", data:{dialogtitle:"Pseudonym"}});
    } else if (spalte == 'Nachname') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '21%'}});
    } else if (spalte == 'Geburtsname') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '31%'}});
    } else if (spalte == 'Vorname') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '41%'}});
    } else if (spalte == 'Geburtsdatum') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '53%'}});
    } else if (spalte == 'Wohnort') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '63%'}});
    } else if (spalte == 'PLZ') {
      this.dialog.open(PatientSearchComponent, {position: {top: '21%', left: '75%'}});
    }
  };

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.patients.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.patients.data.forEach(row => this.selection.select(row));
    this.selectedPatients.emit(this.selection.selected);
  }

  selectedRow(event: MatCheckboxChange, row: Patient) {
    event ? this.selection.toggle(row) : null;
    this.selectedPatients.emit(this.selection.selected);
  }

  ngAfterViewInit(): void {
    this.patients.paginator = this.paginator;
  }
}
