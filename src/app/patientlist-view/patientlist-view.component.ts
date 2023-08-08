import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Observable, of} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {GlobalTitleService} from "../services/global-title.service";

export interface FilterConfig {
  display: string,
  field: string,
  isIdType: boolean,
  hidden: boolean
}

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

  filters: Array<{ display: string, field: string, searchCriteria: string, isIdType: boolean }> = [];
  filterConfigs: Array<FilterConfig> = [];
  loading: boolean = false;

  filterInputValue: string | undefined;
  selectedCriteria: any;
  allPatientsToSearch: Array<string> = [];


  @ViewChild('filterInput')
  filterInput!: ElementRef<HTMLInputElement>;
  filteredFields: Observable<FilterConfig[]> = of([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  defaultPageSize: number = 10 as const;
  pageNumber: number = 100000;

  constructor(
    patientService: PatientService,
    private titleService: GlobalTitleService
  ) {
    this.patientService = patientService;
    this.patientsMatTableData = new MatTableDataSource<Patient>([]);
    this.titleService.setTitle("Patientenliste", true);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add filter
    if (value) {
      // find filter
      let filterConfig: FilterConfig | undefined = this.filterConfigs
      .find(f => new RegExp('^\\s*' + f.display.toLowerCase() + '\\s*:.*$').test(value.toLowerCase().trim()));
      if (filterConfig != undefined) {
        let searchCriteria = value.substring(value.indexOf(':') + 1).trim();
        if (searchCriteria.trim().length > 0) {
          filterConfig.hidden = true;
          this.filters.push({
            display: filterConfig.display,
            field: filterConfig.field,
            searchCriteria: searchCriteria,
            isIdType: filterConfig.isIdType
          });
          console.log("added ", this.filters);
          this.filterInput.nativeElement.value = "";
          // this.filterCtrl.setValue("");
          this.loadPatients(0, this.paginator.pageSize).then();
          // Clear the input value
          event.chipInput!.clear();
        }
      }
    }
    console.log("add status", this.filterConfigs, this.filters);
  }

  remove(filter: any): void {
    const index = this.filters.indexOf(filter);
    this.filterConfigs.filter(e => e.field == filter.field).forEach(e => e.hidden = false);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.loadPatients(0, this.paginator.pageSize).then();
    }
    this.filterCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    //hide selected filter
    let filterConfig = this.filterConfigs.find(e => e.field == event.option.value);
    if (filterConfig) {
      this.selectedCriteria = (filterConfig.display);
      this.filterInput.nativeElement.value = filterConfig.display + ":";
      //this.filterCtrl.setValue(null);
    }
  }

  patientSelected(selectedPatients: Patient[]) {
    this.selectedPatients = selectedPatients;
  }

  async ngOnInit() {
    // init id types in auto complete list
    let configuredIdTypes = this.patientService.getConfigureIdTypes();
    configuredIdTypes.forEach(idType => this.filterConfigs.push({
      field: idType,
      display: idType,
      isIdType: true,
      hidden: false
    }));

    // init. filterConfigs
    this.patientService.getConfiguredFields().forEach(fieldConfig => {
      this.filterConfigs.push({
        field: fieldConfig.mainzellisteField,
        display: fieldConfig.name,
        isIdType: false,
        hidden: false
      });
    })

    // init filters in autocomplete field
    this.filteredFields = this.filterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let searchValue = typeof value === "string" ? value : value.searchCriteria;
        return this.filterConfigs.filter(option => !option.hidden
          && option.display.toLowerCase().includes(searchValue.toLowerCase()));
      }),
    );
    await this.loadPatients(0, this.defaultPageSize);
  }

  async loadPatients(pageIndex: number, pageSize: number) {
    this.loading = true;
    this.patientService.getDisplayPatients(this.filters, pageIndex, pageSize).subscribe(
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
    await this.loadPatients(event.pageIndex, event.pageSize);
  }
}
