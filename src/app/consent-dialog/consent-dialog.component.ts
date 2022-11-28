import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentChoiceItem, ConsentDisplayItem, ConsentItem, ConsentModel} from "../consentModel";
import {ConsentService} from "../consent.service";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatCardModule} from '@angular/material/card';
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";


export interface ConsentTemplate {
  title: string;
  fhirQuestionnaire: fhir4.Questionnaire
}

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
  styleUrls: ['./consent-dialog.component.css']
})

export class ConsentDialogComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  constructor(
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public consentModel: ConsentModel) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  saveChanges() {
    this.consentModel = this.consentDetail.saveChanges();
    console.log("save changed : " + this.consentModel);
    this.dialogRef.close(this.consentModel);
  }
}
