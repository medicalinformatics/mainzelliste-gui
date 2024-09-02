import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {Consent} from "../consent.model";
import {ConsentService} from "../consent.service";

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
  styleUrls: ['./consent-dialog.component.css']
})

export class ConsentDialogComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  constructor(
    private consentService: ConsentService,
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      consent: Consent,
      consentId: string,
      templates: Map<string, string>,
      isSaveButton: boolean,
      readonly: boolean
    }) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.dataModel);
  }
}
