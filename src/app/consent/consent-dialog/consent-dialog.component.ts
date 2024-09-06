import {Component, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsentDetailComponent} from "../consent-detail/consent-detail.component";
import {Consent} from "../consent.model";

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
  styleUrls: ['./consent-dialog.component.css']
})

export class ConsentDialogComponent implements OnInit {

  @ViewChild(ConsentDetailComponent) consentDetail!: ConsentDetailComponent;
  public inProgress: boolean = false
  constructor(
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      consent: Consent,
      templates: Map<string, string>,
      isSaveButton: boolean,
      readonly: boolean,
      edit:boolean,
      processDone: EventEmitter<boolean>
    }) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    if(this.dataModel.processDone)
      this.inProgress = true;
    this.dialogRef.close(this.dataModel);
    if(this.dataModel.processDone)
      this.dataModel.processDone.subscribe(r => this.inProgress = false)
  }
}
