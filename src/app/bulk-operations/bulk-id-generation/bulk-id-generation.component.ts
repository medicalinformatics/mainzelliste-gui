import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxCsvParser, NgxCSVParserError} from 'ngx-csv-parser';
import {saveAs} from 'file-saver';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MatStep, MatStepper} from '@angular/material/stepper';
import {MatSelect} from '@angular/material/select';
import {MatDialog} from '@angular/material/dialog';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {GlobalTitleService} from "../../services/global-title.service";
import {PatientListService} from "../../services/patient-list.service";
import {Patient} from "../../model/patient";
import {BulkIdGenerationEmptyFieldsDialog} from "./dialog/bulk-id-generation-empty-fields-dialog";
import {FieldError} from "../../error/field-error";
import {map} from "rxjs/operators";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-bulk-id-generation',
  templateUrl: './bulk-id-generation.component.html',
  styleUrls: ['./bulk-id-generation.component.css'],
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
export class BulkIdGenerationComponent implements OnInit {

  validFileTypes: string[] = ["text/csv", "application/vnd.ms-excel"];
  csvRecords: string[][] = [];

  /** stats*/
  step: number = 3;
  readingInProgress: boolean = false;
  generationInProgress: boolean = false;
  generationStatus: string = ""

  generated = false;
  dataModel: string = "";
  idType: string = "";
  patients: Patient[] = [];
  data: string = "";
  delimiter: string = ",";
  emptyFields: number = 0;
  public isEditable: boolean = true;
  allowed_length: number = 50000;

  @ViewChild("stepper", { static: true }) stepper!: MatStepper;
  @ViewChild("stepTwo", { static: true }) stepTwo!: MatStep;
  @ViewChild("stepThree", { static: true }) stepThree!: MatStep;
  @ViewChild("select", { static: true }) select!: MatSelect;

  uploadFormGroup = this._formBuilder.group({
    uploadField: ['', [Validators.required]],
  });

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private titleService: GlobalTitleService,
    private ngxCsvParser: NgxCsvParser,
    public patientListService: PatientListService,
    private translate: TranslateService
    ) {
      this.changeTitle();
    }

    changeTitle() {
      this.titleService.setTitle(this.translate.instant('bulkIdGeneration.title'));
    }

    ngOnInit(): void {
      this.translate.onLangChange.subscribe(() => {
        this.changeTitle();
      });

      this.uploadFormGroup.get('uploadField')?.valueChanges.subscribe((file: any) => {
        if (file != null) {
          if(this.validFileTypes.includes(file.type)) {
            this.readCsv(file);
          } else {
            this.uploadFormGroup.get('uploadField')?.setErrors({
              csvError: {
                value: this.translate.instant("bulkIdGeneration.upload_error_file_type")
              }
            })
            this.step = 0;
          }
        }
      });
    }

  readCsv(file: any) {
    this.readingInProgress = true
    file.text().then((content: string) => {
      this.delimiter = content.includes(";") ? ";" : ",";
      this.ngxCsvParser.parse(file, { header: false, delimiter: this.delimiter, encoding: 'utf8' })
      .pipe(
        map(records => {
          if (records instanceof NgxCSVParserError) {
            console.log(records.message)
            throw new FieldError(this.translate, "CSVFileUploader.upload_error_invalid_file");
          }

          //validate
          if (!this.patientListService.getAllIdTypes("R").includes(records[0][0])) {
            throw new FieldError(this.translate, 'bulkIdGeneration.upload_error_read_permission', records[0][0]);
          } else if (records.length > this.allowed_length + 1) {
            throw new FieldError(this.translate, 'bulkIdGeneration.upload_error_file_length');
          } else if (records[0].length <= 2 && (records[0].length == 1 || records[0][1] == "")) {
            for (let i = 1; i < records.length; i++) {
              if (records[i].length >= 3 || !(records[i].length == 1 || records[i][1] == "") || records[i][0] == "") {
                throw new FieldError(this.translate, 'bulkIdGeneration.upload_error_ids');
              }
            }
          } else {
            throw new FieldError(this.translate, 'bulkIdGeneration.upload_error_id_type');
          }
          return records;
        })
      ).subscribe({
        next: (records): void => {
          this.readingInProgress = false
          this.csvRecords = records;
          this.idType = this.csvRecords[0][0];
          this.stepper.next();
          this.step = 1;
        },
        error: (e:FieldError): void => {
          this.readingInProgress = false
          console.log(e)
          this.uploadFormGroup.get('uploadField')?.setErrors({csvError: {value: e.message}})
          this.step = 0;
        }
      });
    });
  }

  generateNewIds(newIdType: string) {
    this.generationInProgress = true;
    this.csvRecords[0][1] = newIdType;
    this.generationStatus = this.translate.instant("bulkIdGeneration.progress_status_start");
    const idStrings = this.csvRecords.filter((r,i) => i>0).map( row => row[0])
    this.patientListService.generateIdArray(this.idType, idStrings, newIdType).subscribe(ids => {
      this.generationStatus = this.translate.instant("bulkPseudonymization.progress_status_prepare_result");
      this.newEntrys(ids);
      this.generationInProgress = false;
      if(this.emptyFields == 0) {
        this.generated = true;
        this.step = 2;
        this.isEditable = false
        this.stepper.next();
      } else if(this.emptyFields + 1 == this.csvRecords.length) {
        this.openDialog(true);
      } else {
        this.openDialog(false);
      }
    });
  }

  downloadCSV() {
    const blob = new Blob([this.setupCSV().join('\n')], {type: 'text/csv', endings: 'native'});
    saveAs(blob, this.idType + ".csv");
  }

  private setupCSV() {
    const csv = [this.csvRecords[0][0] + ";" + this.csvRecords[0][1]];
    for(let i = 1; i < this.csvRecords.length; i++) {
      csv.push(this.csvRecords[i][0] + ";" + this.csvRecords[i][1]);
    }
    return csv;
  }

  private newEntrys(newIds: [{idType: string, idString: string}]) {
    this.emptyFields = 0;
    for(let i = 1; i < this.csvRecords.length; i++) {
      if(newIds[i-1].idString == undefined) {
        this.csvRecords[i][1] = "";
        this.emptyFields++;
      } else {
        this.csvRecords[i][1] = newIds[i-1].idString;
      }
    }
  }

  public geIdTypes(currentIdType: string) {
    return [...this.patientListService.getRelatedAssociatedIdTypes(currentIdType, false, "C"),
      ...this.patientListService.getUniqueIdTypes(false, "C")]
    .filter(idType => idType != currentIdType);
  }

  private openDialog(error: boolean) {
    this.dialog.open(BulkIdGenerationEmptyFieldsDialog, {data: [this.emptyFields, error]}).afterClosed().subscribe(() => {
      if(error) {
        this.backToFirst();
      } else {
        this.generated = true;
        this.step = 2;
        this.isEditable = false;
        this.stepper.next();
      }
    });
  }

  backToFirst() {
    this.reset()
    this.stepper.previous();
  }

  private reset() {
    this.uploadFormGroup.get('uploadField')?.reset();
    this.csvRecords = [];
    this.select.value = '';
    this.dataModel = '';
    this.stepTwo.reset();
    this.step -= 1;
  }

  stepChanged($event: StepperSelectionEvent) {
    if($event.selectedIndex == 0  && $event.previouslySelectedIndex == 1)
      this.reset();
  }
}
