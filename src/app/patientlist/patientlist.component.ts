import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Patient } from "../model/patient";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { PatientListService } from "../services/patient-list.service";
import { AppConfigService } from "../app-config.service";
import { ConsentService } from "../consent/consent.service";
import { Field } from '../model/field';
import { Permission } from "../model/permission";

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PatientlistComponent implements OnInit {
  public readonly Permission = Permission;
  @Input() patients: MatTableDataSource<Patient>;
  @Input() loading: boolean = false;
  selection: SelectionModel<Patient>;
  @Output() selectedPatients: EventEmitter<Patient[]> = new EventEmitter<Patient[]>();
  @Output() filterData = '';

  fields: Field[];
  fieldNames: string[];
  columns: string[] = [];
  showAllIds: boolean;

  configuredIdTypes: string[] = [];
  private patientListService: PatientListService;

  constructor(
    public dialog: MatDialog,
    patientListService: PatientListService,
    configService: AppConfigService,
    public consentService: ConsentService
  ) {
    this.patientListService = patientListService;
    this.patients = new MatTableDataSource<Patient>([]);
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;

    const initialSelection: Patient[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Patient>(allowMultiSelect, initialSelection);
  }

  // openFilter(spalte: string): void{
  //   console.log("opened filter");
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = true;
  //   if (spalte == 'Pseudonym') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container', data:{person:{name:'Simon',age:32,}},});
  //     // this.dialog.open(PatientSearchComponent, {position: {top: '11%', left: '11%'}, minWidth:"20%",minHeight:"40%", data:{dialogtitle:"Pseudonym"}});
  //   } else if (spalte == 'Nachname') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //     } else if (spalte == 'Geburtsname') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //   } else if (spalte == 'Vorname') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //   } else if (spalte == 'Geburtsdatum') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //   } else if (spalte == 'Wohnort') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //   } else if (spalte == 'PLZ') {
  //     this.dialog.open(PatientSearchComponent, { panelClass: 'custom-dialog-container'});
  //   }
  // };

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.patients.data.length;
  //   return numSelected == numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.patients.data.forEach(row => this.selection.select(row));
  //   this.selectedPatients.emit(this.selection.selected);
  // }
  //
  // selectedRow(event: MatCheckboxChange, row: Patient) {
  //   event ? this.selection.toggle(row) : null;
  //   this.selectedPatients.emit(this.selection.selected);
  // }

  ngOnInit(): void {
    this.configuredIdTypes = this.patientListService.getIdTypes("R");
    let displayIdTypes = this.showAllIds ? this.configuredIdTypes : [this.patientListService.findDefaultIdType(this.configuredIdTypes)];
    this.columns = this.columns.concat(displayIdTypes).concat(this.fieldNames).concat(["actions"]);
  }
}
