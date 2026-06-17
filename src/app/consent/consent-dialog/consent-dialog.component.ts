import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {Consent} from "../consent.model";
import {Observable} from "rxjs";
import { NgIf } from '@angular/common';
import { ErrorCardComponent } from '../../shared/components/error-card/error-card.component';
import { FormsModule } from '@angular/forms';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ConsentDetailComponent } from '../consent-detail/consent-detail.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-consent-dialog',
    templateUrl: './consent-dialog.component.html',
    styleUrls: ['./consent-dialog.component.css'],
    imports: [NgIf, MatDialogTitle, ErrorCardComponent, FormsModule, CdkScrollable, MatDialogContent, ConsentDetailComponent, MatDialogActions, MatButton, MatIcon, MatProgressSpinner, TranslatePipe]
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
      submitting: boolean
    }) {
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.dataModel.submitting = true;
    this.dataModel.updateConsentObservable(this.dataModel.consent).subscribe({
      next: () => {},
      error: e => {
        this.dialogRef.close({
          error: e.error,
          dataModel: this.dataModel.consent
        });
        this.dataModel.submitting = false;
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
