import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Observable, of} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {GlobalTitleService} from "../services/global-title.service";
import {TranslateService} from '@ngx-translate/core';

export interface FilterConfig {
  display: string,
  field: string,
  fields: string[],
  isIdType: boolean,
  hidden: boolean
}

@Component({
  selector: 'app-patientlist-view',
  templateUrl: './patientlist-view.component.html',
  styleUrls: ['./patientlist-view.component.css']
})
export class PatientlistViewComponent implements OnInit {

  patientService: PatientService;
  patient: Patient = new Patient();
  fields: Array<string> = [];
  patientsMatTableData: MatTableDataSource<Patient>;
  loading: boolean = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  defaultPageSize: number = 10 as const;
  pageNumber: number = 100000;

  separatorKeysCodes = [ENTER, COMMA] as const;
  filterCtrl = new FormControl();
  @ViewChild('filterInput')
  filterInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger)
  filterAutoCompleteTrigger!: MatAutocompleteTrigger;
  // configured searching keys : id type and fields
  configuredFilteringKeys: Array<FilterConfig> = [];
  // available searching keys used in autocomplete options
  availableFilteringKeys: Observable<FilterConfig[]> = of([]);
  // chip items : entered searching keywords
  filters: Array<{ display: string, field: string, fields: string[], searchCriteria: string, isIdType: boolean }> = [];

  constructor(
    public translate: TranslateService,
    patientService: PatientService,
    private titleService: GlobalTitleService
  ) {
    this.patientService = patientService;
    this.patientsMatTableData = new MatTableDataSource<Patient>([]);
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('patientlistView.title'), false);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add filter
    if (value) {
      // find filter
      let filterConfig: FilterConfig | undefined = this.configuredFilteringKeys
      .find(f => new RegExp('^\\s*' + f.display.toLowerCase() + '\\s*:.*$')
      .test(value.toLowerCase().trim()));

      if (filterConfig != undefined) {
        let searchCriteria = value.substring(value.indexOf(':') + 1).trim();
        if (searchCriteria.trim().length > 0) {
          filterConfig.hidden = true;
          // add filter to mat-chip
          this.filters.push({
            display: filterConfig.display,
            field: filterConfig.field,
            fields: filterConfig.fields,
            searchCriteria: searchCriteria,
            isIdType: filterConfig.isIdType
          });
          this.filterInput.nativeElement.value = "";
          this.filterCtrl.setValue("");
          this.filterAutoCompleteTrigger.closePanel();
          // load patients
          this.loadPatients(0, this.paginator.pageSize).then();
          // // Clear the input value
          // event.chipInput!.clear();
        }
      }
    }
  }

  remove(filter: any): void {
    // show deleted filter in dropdown menu (autocomplete)
    this.configuredFilteringKeys.filter(e => e.field == filter.field).forEach(e => e.hidden = false);

    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      // remove filter from mat-chip
      this.filters.splice(index, 1);
      // load patients
      this.loadPatients(0, this.paginator.pageSize).then();
    }
    this.filterCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // set search input field with search key
    let filterConfig = this.configuredFilteringKeys.find(e => !e.hidden && e.field == event.option.value.field);
    if (filterConfig) {
      this.filterInput.nativeElement.value = filterConfig.display + ":";
    }
  }

  async ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
      this.filterInput.nativeElement.value = '';
    })
    // init. filter data model with id types
    let configuredIdTypes = this.patientService.getConfigureIdTypes();
    configuredIdTypes.forEach(idType => this.configuredFilteringKeys.push({
      field: idType,
      fields: [],
      display: idType,
      isIdType: true,
      hidden: false
    }));

    // init. filter data model with fields
    this.patientService.getConfiguredFields("R").forEach(fieldConfig => {
      let fieldName = fieldConfig.type+"" == 'DATE' ? "birthday" : fieldConfig.mainzellisteField;
      this.configuredFilteringKeys.push({
        field: fieldName,
        fields: fieldConfig.mainzellisteFields,
        display: this.translate.instant(fieldConfig.i18n),
        isIdType: false,
        hidden: false
      });
    })

    // init filters in autocomplete field
    this.availableFilteringKeys = this.filterCtrl.valueChanges.pipe(
      startWith(''),
      map( value => {
        if(typeof value === "string")
          return this.configuredFilteringKeys.filter(option => !option.hidden && option.display.toLowerCase().startsWith(value.toLowerCase()));
        else
          return this.configuredFilteringKeys.filter(option => !option.hidden && option.field == value.field);
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
