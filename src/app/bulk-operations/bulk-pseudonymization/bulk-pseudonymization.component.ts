import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStep, MatStepper} from "@angular/material/stepper";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {GlobalTitleService} from "../../services/global-title.service";
import {NgxCsvParser, NgxCSVParserError} from "ngx-csv-parser";
import {PatientListService} from "../../services/patient-list.service";
import {TranslateService} from "@ngx-translate/core";
import {saveAs} from "file-saver";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {AppConfigService} from "../../app-config.service";
import {FieldError} from "../../error/field-error";
import {AddPatientRequest} from "../../model/add-patient-request";
import {map, startWith} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {IdTypSelection} from "../../patient/create-patient/create-patient.component";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import _moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-bulk-pseudonymization',
  templateUrl: './bulk-pseudonymization.component.html',
  styleUrls: ['./bulk-pseudonymization.component.css'],
  animations: [
    trigger('infoDialogTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BulkPseudonymizationComponent implements OnInit {

  protected readonly Object = Object;
  protected readonly Math = Math;

  validFileTypes: string[] = ["text/csv", "application/vnd.ms-excel"];
  fileName: string = "";
  public externalIdTypes: string[] = [];
  public  fieldNames: string[] = [];

  /** stats*/
  step: number = 3;
  addingInProgress: boolean = false;
  readingInProgress: boolean = false;
  addingStatus: string = ""

  csvRecords: string[][] = []
  undefinedHeaders: string[] = []

  showInfoCard: boolean = true;
  @ViewChild('chipList') chipList!: MatChipList;
  chipListInputCtrl = new FormControl();
  internalIdTypeSelection: IdTypSelection[] = [];
  /** selected chip data model */
  selectedInternalIdTypes: string[] = [];
  /** autocomplete data model */
  filteredInternalIdTypes: Observable<IdTypSelection[]> = of([]);

  delimiter: string = ",";
  public isEditable: boolean = true;

  public addPatientRequests: AddPatientRequest[] = [];

  @ViewChild("originalDataPaginator") originalPaginator!: MatPaginator;
  @ViewChild("resultPaginator") resultPaginator!: MatPaginator;
  public defaultPageSize: number = 10;
  @ViewChild("stepper", {static: true}) stepper!: MatStepper;
  @ViewChild("stepTwo", {static: true}) stepTwo!: MatStep;
  @ViewChild("stepThree", {static: true}) stepThree!: MatStep;

  uploadFormGroup = this._formBuilder.group({
    uploadField: ['', [Validators.required]],
  });

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private titleService: GlobalTitleService,
    private configService: AppConfigService,
    private ngxCsvParser: NgxCsvParser,
    public patientListService: PatientListService,
    public translate: TranslateService
  ) {
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('bulkPseudonymization.title'));
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    });

    this.externalIdTypes = this.patientListService.getAllExternalIdTypes("C");
    this.fieldNames = this.configService.getMainzellisteFields()

    let internalIdTypes  = this.patientListService.getAllInternalIdTypes( "C");
    let mainIdType = this.patientListService.findDefaultIdType(internalIdTypes);
    this.selectedInternalIdTypes.push(mainIdType);

    this.internalIdTypeSelection = internalIdTypes
    .map(t => {
      return {idType: t, added: mainIdType == t}
    });

    this.filteredInternalIdTypes = this.chipListInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let searchValue = value;
        if (value == undefined)
          searchValue = "";
        else if (typeof searchValue !== "string")
          searchValue = value.idType
        return this.internalIdTypeSelection
        .filter(e => !e.added && e.idType.toLowerCase().includes(searchValue.toLowerCase()))
      }),
    );

    this.uploadFormGroup.get('uploadField')?.valueChanges.subscribe((file: any) => {
      if (file != null) {
        if (this.validFileTypes.includes(file.type)) {
          this.readCsv(file);
        } else {
          this.uploadFormGroup.get('uploadField')?.setErrors({
            csvError: {
              value: this.translate.instant("CSVFileUploader.upload_error_invalid_file")
            }
          })
          this.step = 0;
        }
      }
    });
  }

  readCsv(file: any) {
    this.readingInProgress = true
    this.fileName = file.name;
    file.text().then((content: string) => {
      this.delimiter = content.includes(";") ? ";" : ",";
      this.ngxCsvParser.parse(file, {header: false, delimiter: this.delimiter, encoding: 'utf8'})
      .pipe(
        map( records => {
          if (records instanceof NgxCSVParserError) {
            console.log(records.message)
            throw new FieldError(this.translate, "CSVFileUploader.upload_error_invalid_file");
          }
          this.csvRecords = records;
          const csvHeaders = records[0] as string[]

          // check empty headers
          if(records.length == 0 || csvHeaders.length == 0)
            throw new FieldError(this.translate, "CSVFileUploader.upload_error_no_header");

          // check empty rows
          if(records.length <=1)
            throw new FieldError(this.translate, "CSVFileUploader.upload_error_empty");

          // check undefined headers
          const fieldsIndexes = csvHeaders.map((h, i) => this.fieldNames.includes(h.trim())? i : -1).filter( i => i >= 0)
          const idTypesIndexes = csvHeaders.map((h, i) => this.externalIdTypes.includes(h.trim())? i : -1).filter( i => i >= 0)
          this.undefinedHeaders = csvHeaders.filter((h,i) => !fieldsIndexes.includes(i) && !idTypesIndexes.includes(i))
          if (fieldsIndexes.length == 0 && idTypesIndexes.length == 0 && this.undefinedHeaders.length > 0) {
            this.undefinedHeaders = [];
            throw new FieldError(this.translate, "bulkPseudonymization.upload_error_unknown_header")
          }

          // validate fields
          if (fieldsIndexes.length > 0) {
            // check required field
            const missingRequiredFields = this.fieldNames.filter( fieldName => this.configService.getFields()
            .some( f => f.required && (f.mainzellisteField != undefined && f.mainzellisteField.length > 0?
              f.mainzellisteField == fieldName : f.mainzellisteFields.includes(fieldName))))
            .filter( f => !csvHeaders.includes(f))
            if(missingRequiredFields.length > 0)
              throw new FieldError(this.translate, "bulkPseudonymization.upload_error_required_header", missingRequiredFields.join(", "))
          }

          return records.filter((r,i) => i>0).map( row => {
            const fields: { [key: string]: string }  = {};
            fieldsIndexes.forEach( i => fields[csvHeaders[i]] = row[i])
            const idTypes: { [key: string]: string }  = {};
            idTypesIndexes.forEach( i => idTypes[csvHeaders[i]] = row[i])
            return new AddPatientRequest(fields, idTypes);
          })
        })
      ).subscribe({
        next: (requests): void => {
          this.readingInProgress = false
          this.addPatientRequests = requests;
          this.stepper.next();
          this.step = 1;
        },
        error: (e:FieldError): void => {
          this.readingInProgress = false
          console.log(e)
          const invalidHeaderMessage = this.undefinedHeaders.length == 0 ? "" : ". " +
            this.translate.instant("CSVFileUploader.upload_error_some_unknown_header")
            .replace("${}", this.undefinedHeaders.join(", "))
          this.uploadFormGroup.get('uploadField')?.setErrors({csvError: {value: e.message + invalidHeaderMessage}})
          this.step = 0;
        }
      });
    });
  }

  addPatients() {
    this.addingInProgress = true;
    this.addingStatus = this.translate.instant("bulkPseudonymization.progess_status_start");
    this.patientListService.addPatients(this.addPatientRequests,this.selectedInternalIdTypes, false)
    .subscribe({
      next: (responses): void => {
        this.addingStatus = this.translate.instant("bulkPseudonymization.progess_status_prepare_result");
        const l = this.csvRecords[0].length;
        this.csvRecords[0] = this.csvRecords[0].concat(this.selectedInternalIdTypes).concat("error");
        this.addPatientRequests.forEach((r, j) => {
          let i = l;

          if(responses[j].error != undefined)
            i = i + this.selectedInternalIdTypes.length;
          else
            responses[j].ids.forEach( id => this.csvRecords[j+1][i++] = id.idString)
          this.csvRecords[j+1][i++] = responses[j].error ?? ""
        })
        this.addingInProgress = false
        this.step = 2;
        this.isEditable = false
        this.stepper.next();
      },
      error: (e:FieldError): void => {
        this.addingInProgress = false
        console.log(e)
      }
    })
  }

  downloadCSV() {
    const blob = new Blob([
      this.csvRecords.map( row => row.join(";")).join('\n')], {type: 'text/csv', endings: 'native'});
    saveAs(blob, `${_moment().format("DD.MM.YYYY_h:mm:ss")}_${this.fileName}`);
  }

  backToFirst() {
    this.reset()
    this.stepper.previous();
  }

  private reset() {
    this.uploadFormGroup.get('uploadField')?.reset();
    this.stepTwo.reset();
    this.step -= 1;
  }

  stepChanged($event: StepperSelectionEvent) {
    if ($event.selectedIndex == 0 && $event.previouslySelectedIndex == 1)
      this.reset();
  }

  // ID-Types Field
  ////////////////////

  selectedInternalIdType(event: MatAutocompleteSelectedEvent): void {
    this.addInternalIdType(event.option.value);
  }
  findAndAddInternalIdType($event: MatChipInputEvent): void {
    const value = ($event.value || '').trim();
    if (value) {
      this.addInternalIdType(value);
    }

    // Clear the input value
    $event.chipInput.clear();
  }

  private addInternalIdType(idType: string) {
    let idTypeSelection = this.findIdType(idType);
    if (idTypeSelection != undefined) {
      this.selectedInternalIdTypes.push(idTypeSelection.idType);
      idTypeSelection.added = true;
      this.chipListInputCtrl.setValue(null);
      this.chipList.errorState = false;
      this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

  removeInternalIdType(idType: string) {
    const value = (idType || '').trim();

    this.internalIdTypeSelection
    .filter(e => e.idType == value)
    .forEach(e => {
      e.added = false;
    })

    // remove id type from selected id types
    let index = this.selectedInternalIdTypes.findIndex(e => e == value);
    if (index > -1) {
      this.selectedInternalIdTypes.splice(index, 1);
      this.chipList.errorState = this.selectedInternalIdTypes.length == 0;
      this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

  private findIdType(idType: string): IdTypSelection | undefined {
    return this.internalIdTypeSelection.find(e => e.idType == idType && !e.added);
  }

  getPageStart(paginator: MatPaginator) {
    return (paginator != undefined ? paginator.pageIndex * paginator.pageSize : 0);
  }

  getPageEnd(paginator: MatPaginator) {
    return this.getPageStart(paginator) + (paginator != undefined ? paginator.pageSize : this.defaultPageSize);
  }

  public hideInfoDialog() {
    this.showInfoCard = false;
  }

  public getSuccessfullyPseudonymized(): number {
    if (this.csvRecords.length == 0)
      return 0;
    const lastIndex = this.csvRecords[0].length - 1
    return this.csvRecords.filter( r => r[lastIndex]?.length == 0).length
  }
}
