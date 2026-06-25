import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import {PatientService} from "../../../services/patient.service";
import {saveAs} from "file-saver";
import _moment from "moment/moment";
import { MatSelectionList, MatSelectionListChange, MatListOption } from "@angular/material/list";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import {animate, style, transition, trigger} from "@angular/animations";
import {FilterItem} from "../../../model/filter-item";
import { NgFor, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardTitleGroup, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {DateTime} from "luxon";

@Component({
    selector: 'app-export-patients-dialog',
    templateUrl: './export-patients-dialog.component.html',
    styleUrls: ['./export-patients-dialog.component.css'],
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
    ],
    imports: [MatDialogTitle, MatSelectionList, NgFor, MatListOption, MatFormField, MatLabel, MatSelect, FormsModule, MatOption, NgIf, MatCard, MatCardTitleGroup, MatIcon, MatIconButton, MatCardContent, MatButton, MatDialogActions, MatProgressSpinner, TranslatePipe]
})
export class ExportPatientsDialogComponent implements OnInit {

  csvRecords: string[][] = []
  inProgress: boolean = false;
  exportSucceeded: boolean = false;
  showInfoCard: boolean = false;
  csvDelimiter: string = ',';

  constructor(
    public dialogRef: MatDialogRef<ExportPatientsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {
      fieldNames: string[],
      searchFilter: Array<FilterItem>
    },
    public patientService: PatientService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
    this.csvRecords = []
  }

  onExport(selectionFields: MatSelectionList):void {
    this.inProgress = true;
    this.patientService.getDisplayPatients(this.data.searchFilter, -1, 0, true).subscribe(response => {
      this.csvRecords[0] = selectionFields._value ?? selectionFields.selectedOptions.selected.map(s => s.value);
      response.patients.forEach((patient, r) => {
        this.csvRecords.push([]);
        this.csvRecords[0].forEach( (f, i) => {
          if(patient.fields[f] instanceof DateTime)
            this.csvRecords[r+1][i] = (patient.fields[f] as DateTime).setLocale(this.translate.getCurrentLang())
            .toLocaleString(DateTime.DATE_SHORT);
          else
            this.csvRecords[r+1][i] = patient.fields[f] as string ?? patient.ids.find( id => id.idType == f)?.idString ?? ""
        })
      })
      this.inProgress = false;
      this.exportSucceeded = true;
      this.showInfoCard = true;
    });
  }

  downloadCSV() {
    const blob = new Blob([
      this.csvRecords.map( row => row.join(this.csvDelimiter)).join('\n')], {type: 'text/csv', endings: 'native'});
    saveAs(blob, `patient_data_${_moment().format("DD.MM.YYYY_h:mm:ss")}.csv`);
  }

  fieldListChange($event: MatSelectionListChange) {
    if($event.source.selectedOptions.selected.length == 1) {
      $event.source.selectedOptions.selected[0].disabled = true
    } else {
      $event.source.selectedOptions.selected.forEach( s => s.disabled = false);
    }
  }
}
