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
import {AuthorizationService} from "../services/authorization.service";
import {TranslateService} from "@ngx-translate/core";
import {LocalStorageService} from "../services/local-storage.service";
import {
  ExportPatientsDialogComponent
} from "./dialogs/export-patients-dialog/export-patients-dialog.component";
import {FilterItem} from "../model/filter-item";
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

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
  @Input() searchFilter: Array<FilterItem> = [];
  selection: SelectionModel<Patient>;
  @Output() selectedPatients: EventEmitter<Patient[]> = new EventEmitter<Patient[]>();
  @Output() filterData = '';

  fields: Field[];
  fieldNames: string[];
  columns: string[] = [];
  allColumnNames: string[] = [];
  showAllIds: boolean;

  configuredIdTypes: string[] = [];
  public defaultIdType:  string = "";
  public mergeActive: boolean = false;
  public masterSelect: boolean = false;

  mainIdType : string ="";

  constructor(
    public dialog: MatDialog,
    private patientListService: PatientListService,
    private configService: AppConfigService,
    public authorizationService: AuthorizationService,
    public consentService: ConsentService,
    public localStorageService:LocalStorageService,
    private translate: TranslateService,
    public exportPatientsDialog: MatDialog,
    public router: Router,
  ) {
    let internalIdTypes  = this.patientListService.getAllInternalIdTypes( "C");
    this.mainIdType = this.patientListService.findDefaultIdType(internalIdTypes);
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

  isAllSelected() {
  const numSelected = this.selection.selected.length;
   const numRows = this.patients.data.length;
   return numSelected == numRows;
  }

  /** clears selection. */
  masterToggle() {
    this.selection.clear();
    this.selectedPatients.emit([]);
    this.masterSelect = false;
  }
 
  selectedRow(event: MatCheckboxChange, row: Patient) {
    if (event.checked) {
      // Prevent selecting more than 2
      if (this.selection.selected.length >= 2) {
        event.source.checked = false; // Uncheck the checkbox
        return;
      }
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }

    this.selectedPatients.emit(this.selection.selected);
  }

  ngOnInit(): void {
    this.configuredIdTypes = this.patientListService.getIdTypes("R");
    this.defaultIdType = this.patientListService.findDefaultIdType(this.configuredIdTypes);

    // find all possible columns
    this.allColumnNames = this.allColumnNames.concat(this.configuredIdTypes).concat(this.fieldNames);
    if(this.showTenantColumn())
      this.allColumnNames.push("tenants");
    this.allColumnNames.push("actions");
    this.allColumnNames.unshift("select");

    // load columns from browser storage
    const storedColumns = this.localStorageService.patientListColumns
    if(storedColumns.length > 0 && storedColumns.every(c => this.allColumnNames.some( e => e == c))){
      this.columns = storedColumns;
    } else {
      let displayIdTypes = this.showAllIds ? this.configuredIdTypes : [this.defaultIdType];
      this.columns = this.columns.concat(displayIdTypes).concat(this.fieldNames);
      if(this.showTenantColumn())
        this.columns.push("tenants");
      this.columns.push("actions");
      this.columns.unshift("select");

      this.localStorageService.patientListColumns = this.columns
    }
  }

  showTenantColumn(){
    return this.configService.showDomainsInIDCard() && this.authorizationService.getTenants().length > 1;
  }

  getColumnDisplayText(columnName: string) {
    const field = this.fields.find( f => f.name == columnName);
    if(field != undefined){
      return this.translate.instant(field.i18n)
    } else if(columnName == "actions"){
      return this.translate.instant('patientlist.headers_actions')
    } else if(columnName == "tenants"){
      return this.translate.instant('patientlist.headers_tenants')
    } else {
      return columnName
    }
  }

  selectColumns(selectedColumns: string []) {
    this.localStorageService.patientListColumns = selectedColumns;
  }

  hideColumn(columnName: string) {
    return columnName == "actions" || columnName == this.defaultIdType;
  }

  public openExportPatientsDialog() {
    this.exportPatientsDialog.open(ExportPatientsDialogComponent, {
      data: {
        fieldNames: this.configuredIdTypes.concat(this.fieldNames),
        searchFilter: this.searchFilter
      }
    });
  }

  public startMerge(){
    this.mergeActive = !this.mergeActive;
    if(!this.mergeActive){
      this.selection.clear();
      this.selectedPatients.emit([]);
      this.masterSelect = false;
    }
  }
  public executeMerge() {
    const patients: Patient[] = this.selection.selected;  // get the selected patients
    const patientIds = patients
    .map(p => p.ids.find(id => id.idType === this.mainIdType)?.idString)
    .filter(id => id !== undefined)
    .join(',');
    this.router.navigate(['/manuel-merge', patientIds, this.mainIdType]);
  }

}
