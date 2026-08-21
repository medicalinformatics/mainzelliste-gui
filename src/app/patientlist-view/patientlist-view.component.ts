import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipRow
} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Observable, of} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {GlobalTitleService} from "../services/global-title.service";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthorizationService} from "../services/authorization.service";
import {CardError} from "../error/card-error";
import {FilterItem} from "../model/filter-item";
import * as papaparse from "papaparse"
import {ParseResult} from "papaparse"
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {AsyncPipe, NgFor, NgIf, NgStyle} from '@angular/common';
import {MatBadge} from '@angular/material/badge';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/select';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PatientlistComponent} from '../patientlist/patientlist.component';
import {MatDialog} from "@angular/material/dialog";
import {Permission} from "../model/permission";
import {HasPermissionDirective} from "../shared/directives/has-permission.directive";
import {
  FindSimilarPatientsDialogComponent
} from "../patientlist/dialogs/find-similar-patients-dialog/find-similar-patients-dialog.component";
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";

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
    styleUrls: ['./patientlist-view.component.css'],
    imports: [MatFormField, MatLabel, MatChipGrid, NgFor, MatChipRow, MatBadge, MatIcon, MatChipRemove, MatChipInput, FormsModule, MatAutocompleteTrigger, ReactiveFormsModule, MatAutocomplete, MatOption, MatIconButton, MatSuffix, MatTooltip, NgIf, NgStyle, MatProgressSpinner, PatientlistComponent, MatPaginator, AsyncPipe, TranslatePipe, HasPermissionDirective]
})
export class PatientlistViewComponent implements OnInit {

  public readonly Permission = Permission;
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
  // configured searching keys: id type and fields
  configuredFilteringKeys: Array<FilterConfig> = [];
  // metadata of find similar patient chip
  public static readonly  SIMILAR_PATENT_SPECIAL_FIELD = "similarPatient"
  similarPatientFilter: FilterConfig = {
    display: "Similar Patient",
    field: PatientlistViewComponent.SIMILAR_PATENT_SPECIAL_FIELD,
    fields: [],
    isIdType: false,
    hidden: true
  };
  semanticFields: { [key: string]: Field };
  // available searching keys used in autocomplete options
  availableFilteringKeys: Observable<FilterConfig[]> = of([]);
  // chip items : entered searching keywords
  filters: Array<FilterItem> = [];
  uploadCSVinProgress: boolean = false;

  constructor(
    public translate: TranslateService,
    patientService: PatientService,
    public authorizationService: AuthorizationService,
    private titleService: GlobalTitleService,
    public findSimilarPatientsDialog: MatDialog,
    private fieldService: FieldService
  ) {
    this.patientService = patientService;
    this.patientsMatTableData = new MatTableDataSource<Patient>([]);
    this.changeTitle();
    this.semanticFields = this.fieldService.getSemanticFields();
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
          this.resetAfterFiltering();
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
    // show disabled filters if similarPatient filter is active
    if(filter.field == PatientlistViewComponent.SIMILAR_PATENT_SPECIAL_FIELD)
      this.configuredFilteringKeys.forEach(f => f.hidden = false);

    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      // remove filter from mat-chip
      this.filters.splice(index, 1);
      this.filters = [ ... this.filters];
      this.paginator.firstPage();
      // load patients
      this.loadPatients(0, this.paginator.pageSize).then();
    }
    this.filterCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  removeAllFilter(): void {
    this.filters = [];
    this.paginator.firstPage();
    // load patients
    this.loadPatients(0, this.paginator.pageSize).then();
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
    this.patientService.getDisplayPatients(this.filters, pageIndex, pageSize,
        this.filters.some( f => typeof (f.searchCriteria) !== 'string'),
        this.authorizationService.getTenants()).subscribe({
      next: (response) => {
        this.patientsMatTableData.data = response.patients;
        this.pageNumber = parseInt(response.totalCount);
        this.loading = false;
      },
      error: (error) => {
        this.patientsMatTableData.data = [];
        this.pageNumber = 0;
        this.loading = false
        throw error;
      }
    })
  }

  async handlePageEvent(event: PageEvent) {
    await this.loadPatients(event.pageIndex, event.pageSize);
  }

  onUploadSearchIDsFromCSV($event: Event) {
    this.filterAutoCompleteTrigger.closePanel();
    if(this.filters.length > 0)
      this.removeAllFilter();
    this.filterAutoCompleteTrigger.closePanel();
    this.uploadCSVinProgress = true;
    const target = $event.target as HTMLInputElement;
    const files = target.files as FileList;
    if(files != null && files.length >0) {
      new Observable<ParseResult<unknown>>(
        observable  => {
          papaparse.parse(files[0], {
            encoding: 'utf8',
            complete: function (content) {
              observable.next(content);
              observable.complete();
            }
          })
        }
      )
      .pipe(
        map(content=> {
          let csvHeaders = (content.data[0] as string[])
          if(csvHeaders && csvHeaders.length == 1 && csvHeaders[0].trim().length == 0)
            csvHeaders.pop();
          if (content.data.length == 0 || !csvHeaders || csvHeaders.length == 0)
            throw new CardError(this.translate, "CSVFileUploader.upload_error_no_header");

          // check no content
          if (content.data.length <= 1)
            throw new CardError(this.translate, "CSVFileUploader.upload_error_empty");

          const configuredIdTypes = this.patientService.getConfigureIdTypes()
          const invalidHeaders = csvHeaders.filter(c => c.length != 0 && !configuredIdTypes.includes(c));
          if (invalidHeaders.length > 0)
            throw new CardError(this.translate, "CSVFileUploader.upload_error_some_unknown_header", invalidHeaders.join(", "));

          let filterConfigs: FilterConfig[] = this.configuredFilteringKeys
          .filter(f => f.isIdType && csvHeaders.includes(f.field));

          // add search filters
          filterConfigs.forEach(filterConfig => {
            const i = csvHeaders.indexOf(filterConfig.field);
            const ids = content.data.filter((l, j) => j > 0)
            .map(l => (l as string[])[i])
            .filter(w => w && w.trim().length > 0);
            if(ids.length > 0) {
              filterConfig.hidden = true;
              this.filters.push({
                display: filterConfig.display,
                field: filterConfig.field,
                fields: filterConfig.fields,
                searchCriteria: ids,
                isIdType: filterConfig.isIdType
              });
            }
          });
        })
      ).subscribe({
        next: (requests): void => {
          this.uploadCSVinProgress = false;
          this.filterInput.nativeElement.value = "";
          this.filterCtrl.setValue("");
          this.paginator.firstPage();
          // load patients
          this.loadPatients(0, this.paginator.pageSize).then();
        },
        error: (e: CardError): void => {
          this.uploadCSVinProgress = false;
          this.filterInput.nativeElement.value = "";
          this.filterCtrl.setValue("");
          throw e;
        }
      });
    }
  }

  public isString(searchValue: string | string []): boolean {
    return typeof (searchValue) === 'string';
  }

  public openFindSimilarPatientsDialog() {
    if(this.filters.length > 0)
      this.removeAllFilter();
    this.findSimilarPatientsDialog.open(FindSimilarPatientsDialogComponent, {
      width: '600px',
      disableClose: true
    })
    .afterClosed().subscribe({
    next: result => {
      // undefined: dialog was cancelled without searching -> leave the list untouched
      if (result === undefined) {
        return;
      }
      // add chip
      this.filters = [{
        display: this.similarPatientFilter.display,
        field: this.similarPatientFilter.field,
        fields: [],
        isIdType: false,
        searchCriteria: result?.filterDisplay ?? ""
      }]
      // hide all the rest
      this.configuredFilteringKeys.forEach(f => f.hidden = true);
      this.resetAfterFiltering();

      // null: search ran but found no match -> clear the list
      this.patientsMatTableData.data = result?.matchResults ? result.matchResults : [];
      this.pageNumber = result?.totalCount ?? 0;
    },
    error: e => {
      this.patientsMatTableData.data = [];
      this.pageNumber = 0;
      this.loading = false
    }
    });
  }

  resetAfterFiltering(){
    this.filterInput.nativeElement.value = "";
    this.filterCtrl.setValue("");
    this.filterAutoCompleteTrigger.closePanel();
    this.paginator.firstPage();
  }
}
