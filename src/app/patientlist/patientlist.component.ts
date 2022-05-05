import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input, OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PatientSearchComponent} from "../patientSearch/patientSearch.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {PatientListService} from "../services/patient-list.service";

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PatientlistComponent implements AfterViewInit, OnInit{
  patients: MatTableDataSource<Patient>;
  selection: SelectionModel<Patient>;
  @Output() selectedPatients: EventEmitter<Patient[]> = new EventEmitter<Patient[]>();
  @Output() filterData = '';

  //SIMILAR-PATIENT-FEATURE
  @Output() similarPatientEvent = new EventEmitter<Patient>();

  fields: string[] = ["Nachname", "Geburtsname", "Vorname", "Geburtsdatum", "Wohnort", "PLZ"];
  columns: string[] = ["select"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pseudonyms: string[]=[];
  private patientListService: PatientListService;

  constructor(public dialog: MatDialog, patientListService: PatientListService, patientService: PatientService) {
    this.patientListService = patientListService;
    this.patients = patientService.patientsDataSource;

    const initialSelection: Patient[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Patient>(allowMultiSelect, initialSelection);
  }

  openFilter(spalte: string): void{
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'Pseudonym') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container', data:{person:{name:'Simon',age:32,}},});
      // this.dialog.open(PatientSearchComponent, {position: {top: '11%', left: '11%'}, minWidth:"20%",minHeight:"40%", data:{dialogtitle:"Pseudonym"}});
    } else if (spalte == 'Nachname') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
      } else if (spalte == 'Geburtsname') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
    } else if (spalte == 'Vorname') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
    } else if (spalte == 'Geburtsdatum') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
    } else if (spalte == 'Wohnort') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
    } else if (spalte == 'PLZ') {
      this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
    }
  };

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

  ngOnInit(): void{
      this.patientListService.getPatientListIdTypes().then((idTypes) => {
        this.pseudonyms = idTypes;
        this.columns = this.columns.concat(idTypes).concat(this.fields).concat(["actions"]);
      })
  }

  startSimilarPatientSearch(sPatient: Patient) {
    this.similarPatientEvent.emit(sPatient);
  }
}
