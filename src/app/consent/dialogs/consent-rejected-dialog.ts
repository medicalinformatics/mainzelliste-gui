import {Component, Inject} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {Observable} from "rxjs";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'consent-rejected-dialog',
    templateUrl: 'consent-rejected-dialog.html',
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, NgIf, MatIcon, MatProgressSpinner, TranslatePipe]
})
export class ConsentRejectedDialog {
  public inProgress: boolean = false
  constructor(
    public dialogRef: MatDialogRef<ConsentRejectedDialog>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      updateConsentObservable: Observable<any>
    }
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.dataModel.updateConsentObservable.subscribe({
      next: () => {},
      error: e => {
        this.dialogRef.close();
        this.inProgress = false;
      },
      complete: () => {
        this.dialogRef.close();
        this.inProgress = false;
      }
    });
  }
}
