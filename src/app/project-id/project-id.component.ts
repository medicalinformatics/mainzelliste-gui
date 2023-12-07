import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { PatientListService } from '../services/patient-list.service';
import { Patient } from '../model/patient';
import { saveAs } from 'file-saver';
import { FormControl, Validators } from '@angular/forms';
import { GlobalTitleService } from '../services/global-title.service';
import { TranslateService } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.css']
})
export class ProjectIdComponent implements OnInit {

  csvRecords: string[][] = [];
  step: number = 3;
  generated = false;
  dataModel: string = "";
  idType: string = "";
  idStrings: string[] = [];
  patients: Patient[] = [];
  data: string = "";
  accept: string = '.csv';
  multiple: boolean = false;
  placeholder: string = 'name.csv';
  csvUpload: FormControl;
  public file: any;
  isLinear: boolean = true;

  @ViewChild("stepper", { static: false }) stepper!: MatStepper;

  @ViewChild("select", { static: false }) select!: MatSelect;
      
  constructor(
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
        this.file = file;
        this.fileChangeListener(this.file);
        this.isValidFile();
      });
    }

  fileChangeListener(file: any): void {
    let files: any[] = [file];
    let tempRecords: any;
    if(files != null && files[0] != undefined && files[0].type == "text/csv") {
      this.ngxCsvParser.parse(files[0], { header: false, delimiter: ';', encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          tempRecords = result;
          let bool = false;
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
    } else {
      console.log('Error2');
      this.step = 0;
    }
  }

  generateNewIds(idT: string) {
    this.csvRecords[0][1] = idT;
    this.patientListService.generateIdArray(this.idType, this.idStrings, idT).subscribe(ids => {
      this.newEntrys(ids);
      this.generated = true;
      this.step = 2;
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
    for(let i = 1; i < this.csvRecords.length; i++) {
      if(newIds[i-1].idString == undefined) {
        this.csvRecords[i][1] = "";
      } else {
        this.csvRecords[i][1] = newIds[i-1].idString;
      }
    } 
  }

  isValidFile() {
    if(this.file !=undefined && this.file.type == "text/csv") {
      this.stepper.next();
    }
  }
  
  backToFirst() {
    this.csvUpload.reset();
    this.file = undefined;
    this.reset();
  }
  
  backToSecond() {
    this.reset();
    this.fileChangeListener(this.file);
  }

  private reset() {
    this.csvRecords = [];
    this.stepper.previous();
    this.select.value = '';
    this.dataModel = '';
  }
}
