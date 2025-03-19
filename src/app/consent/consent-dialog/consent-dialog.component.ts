import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Consent} from "../consent.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
  styleUrls: ['./consent-dialog.component.css']
})

export class ConsentDialogComponent implements OnInit {

  public inProgress: boolean = false
  errorMessages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      consent: Consent,
      templates: Map<string, string>,
      updateConsentObservable: (consent: Consent) => Observable<any>,
      isSaveButton: boolean,
      readonly: boolean,
      edit:boolean
    }) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.dataModel.updateConsentObservable(this.dataModel.consent).subscribe({
      next: () => {},
      error: e => {
        this.dialogRef.close({
          error: e.error,
          dataModel: this.dataModel.consent
        });
        this.inProgress = false;
      },
      complete: () => {
        this.dialogRef.close({
          dataModel: this.dataModel.consent
        });
        this.inProgress = false;
      }
    });
  }
}
