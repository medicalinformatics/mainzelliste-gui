import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-patientlist-view',
  templateUrl: './patientlist-view.component.html',
  styleUrls: ['./patientlist-view.component.css']
})
export class PatientlistViewComponent implements OnInit {
  title = "Patientenliste";
  patientService: PatientService;
  patient: Patient = new Patient();
  fields: Array<string> = [];
  selectedPatients: Array<Patient> = [];
  patientsMatTableData: MatTableDataSource<Patient>;

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA] as const;
  filterCtrl = new FormControl();

  filters: Array <{display:string, field:string, searchCriteria:string, isIdType: boolean}> = [];
  filterConfigs: Array <{display:string, field:string, isIdType: boolean, hidden: boolean}> = [];
  loading: boolean = false;

  filterInputValue: string | undefined;
  selectedCriteria: any;
  allPatientsToSearch: Array <string>=[];


  @ViewChild('fruitInput')
  filterInput!: ElementRef<HTMLInputElement>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  defaultPageSize: number = 10 as const;
  pageNumber: number = 100000;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
    this.patientsMatTableData = new MatTableDataSource<Patient>([]);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
     let filter:{ display:string, field: string, searchCriteria: string, isIdType: boolean, hidden: boolean } = JSON.parse(event.value);
      this.filters.push(filter);
      this.filterConfigs.filter(e => !e.isIdType && e.field == filter.field).forEach(e => e.hidden = true);
      this.loadPatients(true, 0, this.paginator.pageSize).then();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(filter: any): void {
    const index = this.filters.indexOf(filter);
    this.filterConfigs.filter(e => !e.isIdType && e.field == filter.field).forEach(e => e.hidden = false);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.loadPatients(true, 0, this.paginator.pageSize).then();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filterConfigs.filter(e => !e.isIdType && e.field == event.option.value.field).forEach(e => e.hidden = true);
    this.filters.push(event.option.value);
    this.selectedCriteria=(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.loadPatients(true, 0, this.paginator.pageSize).then();
  }

  patientSelected(selectedPatients: Patient[]) {
    this.selectedPatients = selectedPatients;
  }

  async ngOnInit() {
    // init id types in auto complete list
    let configuredIdTypes = this.patientService.getConfigureIdTypes();
    configuredIdTypes.forEach( idType => this.filterConfigs.push({field: idType, display: "Pseudonym (" + idType + ")", isIdType: true, hidden: false}));
    // init. fields
    this.patientService.getConfiguredFields().forEach( fieldConfig => {
      this.filterConfigs.push({field: fieldConfig.mainzellisteField, display: fieldConfig.name, isIdType: false, hidden: false});
    })
    await this.loadPatients(false, 0, this.defaultPageSize);
  }

  async loadPatients(displayEmpty: boolean, pageIndex: number, pageSize: number) {
    this.loading = true;
    this.patientService.getDisplayPatients(this.filters,
      displayEmpty, pageIndex, pageSize).subscribe(
      response => {
        this.patientsMatTableData.data = response.patients;
        this.pageNumber = parseInt(response.totalCount);
        this.loading = false;
      },
      error => {
        this.patientsMatTableData.data = [];
        this.pageNumber = 0;
        this.loading = false
        throw error;
      }
    )
  }

  async handlePageEvent(event: PageEvent) {
    await this.loadPatients(false, event.pageIndex, event.pageSize);
  }
}
