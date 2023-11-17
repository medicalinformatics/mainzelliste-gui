import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { PatientListService } from '../services/patient-list.service';
import { Patient } from '../model/patient';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-projekt-id',
  templateUrl: './projekt-id.component.html',
  styleUrls: ['./projekt-id.component.css']
})
export class ProjektIdComponent {

  csvRecords: string[][] = [];
  displayedColumns: string[] = ['ids'];
  show: number = 2;
  generated = false;
  dataModel: string = "";
  idType: string = "";
  idStrings: string[] = [];
  patients: Patient[] = [];
  data: string = "";

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public patientListService: PatientListService
    ) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
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
            this.show = 1;  
          } else {
            this.show = 0;
          }
        },
        error: (): void => {
          console.log('Error');
          this.show = 0;
        }
      });
    } else {
      console.log('Error');
      this.show = 0;
    }
  }

  generateNewIds(idT: string) {
    this.csvRecords[0][1] = idT;
    this.patientListService.generateIdArray(this.idType, this.idStrings, idT).subscribe(ids => {
      this.newEntrys(ids);
      this.generated = true;
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

}
