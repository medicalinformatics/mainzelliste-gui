import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {Consent} from "../model/consent";

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
  styleUrls: ['./consent-dialog.component.css']
})

export class ConsentDialogComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;

  constructor(
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: Consent) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.dataModel);
  }
}
