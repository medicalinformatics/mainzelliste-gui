import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { PatientListService } from '../services/patient-list.service';
import { Patient } from '../model/patient';
import { saveAs } from 'file-saver';
import { FormControl, Validators } from '@angular/forms';
import { GlobalTitleService } from '../services/global-title.service';
import { TranslateService } from '@ngx-translate/core';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ProjectIdEmptyFieldsDialog } from './dialog/project-id-empty-fields-dialog';

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.css']
})
export class ProjectIdComponent implements OnInit {

  validFileTypes: string[] = ["text/csv"];
  csvRecords: string[][] = [];
  step: number = 3;
  generated = false;
  dataModel: string = "";
  idType: string = "";
  idStrings: string[] = [];
  patients: Patient[] = [];
  data: string = "";
  multiple: boolean = false;
  placeholder: string = 'name.csv';
  csvUpload: FormControl;
  public file: any;
  delimiter: string = ",";
  isLinear: boolean = true;
  emptyFields: number = 0;

  @ViewChild("stepper", { static: false }) stepper!: MatStepper;
  @ViewChild("stepTwo", { static: false }) stepTwo!: MatStep;
  @ViewChild("stepThree", { static: false }) stepThree!: MatStep;
  @ViewChild("select", { static: false }) select!: MatSelect;
      
  constructor(
    public dialog: MatDialog,
    private titleService: GlobalTitleService,
    private ngxCsvParser: NgxCsvParser,
    public patientListService: PatientListService,
    private translate: TranslateService
    ) {
      this.csvUpload = new FormControl(this.file, [
        Validators.required
      ]);
      this.changeTitle();
    }
  
    changeTitle() {
      this.titleService.setTitle(this.translate.instant('project_id.title'));
    }

    ngOnInit(): void {
      this.translate.onLangChange.subscribe(() => {
        this.changeTitle();
      });
      this.csvUpload.valueChanges.subscribe((file: any) => {
        if (file != null) {
          this.file = file;
          console.log(this.file.type)
          this.fileChangeListener(this.file);
        }
      });
    }

  fileChangeListener(file: any): void {
    if(file != null && file != undefined && this.validFileTypes.includes(file.type)) {
      this.readCsv(file);
    } else {
      console.log('Error2');
      this.step = 0;
    }
  }

  readCsv(file: any) {
    let tempRecords: any;
    file.text().then((content: string) => {
      console.log(content);
      this.delimiter = content.includes(";") ? ";" : ",";
      this.ngxCsvParser.parse(file, { header: false, delimiter: this.delimiter, encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          console.log(result);
          console.log("String");
          console.log(result.toString());
          tempRecords = result;
          let bool = false;
          console.log(this.patientListService.getIdTypes())
          if (this.patientListService.getIdTypes().includes(tempRecords[0][0]) && tempRecords[0].length <= 2 && (tempRecords[0].length = 1 || tempRecords[0][tempRecords[0].length] == "")) {
            bool = true;
            for (let i = 1; i < tempRecords.length; i++) {
              if (tempRecords[i].length >= 3 || !(tempRecords[i].length = 1 || tempRecords[i][tempRecords[i].length] == "")) {
                bool = false;
              }
            }
          }
          if (bool) {
            this.csvRecords = tempRecords;
            this.idType = this.csvRecords[0][0];
            for(let i = 1; i < this.csvRecords.length; i++) {
              this.idStrings[i-1] = this.csvRecords[i][0];
            }
            this.stepper.next();
            this.step = 1;  
          } else {
            this.step = 0;
            console.log(this.step);
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
        this.stepper.next();
      } else if(this.emptyFields + 1 == this.csvRecords.length) {
        this.openDialog(true);
      } else {
        this.openDialog(false);
      }
    });
  }

  downloadCSV() {
    var blob = new Blob([this.setupCSV().join('\n')], {type: 'text/csv', endings: 'native'});
    saveAs(blob, this.idType + ".csv");
  }

  private setupCSV() {
    var csv = [this.csvRecords[0][0] + ";" + this.csvRecords[0][1]];
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

  private openDialog(error: boolean) {
    this.dialog.open(ProjectIdEmptyFieldsDialog, {data: [this.emptyFields, error]}).afterClosed().subscribe(() => {
      if(error) {
        this.backToFirst();
      } else {
        this.generated = true;
        this.step = 2;
        this.stepper.next();
      }
    });
  }
  
  backToFirst() {
    this.reset();
    this.stepTwo.reset();
    this.step -= 1;
  }

  private reset() {
    this.csvUpload.reset();
    this.file = undefined;
    this.csvRecords = [];
    this.stepper.previous();
    this.select.value = '';
    this.dataModel = '';
  }
}
