import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxCsvParser} from 'ngx-csv-parser';
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

@Component({
  selector: 'app-bulk-id-generation',
  templateUrl: './bulk-id-generation.component.html',
  styleUrls: ['./bulk-id-generation.component.css']
})
export class BulkIdGenerationComponent implements OnInit {

  validFileTypes: string[] = ["text/csv", "application/vnd.ms-excel"];
  csvRecords: string[][] = [];
  step: number = 3;
  generated = false;
  dataModel: string = "";
  idType: string = "";
  idStrings: string[] = [];
  patients: Patient[] = [];
  data: string = "";
  public file: any;
  delimiter: string = ",";
  emptyFields: number = 0;
  public isEditable: boolean = true;

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
          this.file = file;
          if(this.validFileTypes.includes(file.type)) {
            this.readCsv(file);
          } else {
            this.uploadFormGroup.get('uploadField')?.setErrors({invalidFileType:{value:file.type}})
            this.step = 0;
          }
        }
      });
    }

  readCsv(file: any) {
    let tempRecords: any;
    file.text().then((content: string) => {
      this.delimiter = content.includes(";") ? ";" : ",";
      this.ngxCsvParser.parse(file, { header: false, delimiter: this.delimiter, encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          tempRecords = result;
          if (!this.patientListService.getAllIdTypes("R").includes(tempRecords[0][0])) {
            this.uploadFormGroup.get('uploadField')?.setErrors({invalidIdType:{value:tempRecords[0][0]}})
          } else if (tempRecords.length > 50001) {
            this.uploadFormGroup.get('uploadField')?.setErrors({invalidFileLength:{value:""}})
          } else if (tempRecords[0].length <= 2 && (tempRecords[0].length == 1 || tempRecords[0][1] == "")) {
            for (let i = 1; i < tempRecords.length; i++) {
              if (tempRecords[i].length >= 3 || !(tempRecords[i].length == 1 || tempRecords[i][1] == "") || tempRecords[i][0] == "") {
                this.uploadFormGroup.get('uploadField')?.setErrors({invalidIds:{value:""}})
                break;
              }
            }
          } else {
            this.uploadFormGroup.get('uploadField')?.setErrors({invalidIdTypeList:{value:""}})
          }
          if (!this.uploadFormGroup.get('uploadField')?.invalid) {
            this.csvRecords = tempRecords;
            this.idType = this.csvRecords[0][0];
            for(let i = 1; i < this.csvRecords.length; i++) {
              this.idStrings[i-1] = this.csvRecords[i][0];
            }
            this.stepper.next();
            this.step = 1;
          } else {
            this.step = 0;
          }
        },
        error: (): void => {
          console.log('Error1');
          this.step = 0;
        }
      });
    });
  }

  generateNewIds(idT: string) {
    this.csvRecords[0][1] = idT;
    this.patientListService.generateIdArray(this.idType, this.idStrings, idT).subscribe(ids => {
      this.newEntrys(ids);
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
    this.file = undefined;
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
