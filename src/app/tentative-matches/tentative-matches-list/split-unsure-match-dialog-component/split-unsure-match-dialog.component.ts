import {Component, Inject} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-split-unsure-match-dialog',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    TranslatePipe,
    NgIf
  ],
  templateUrl: './split-unsure-match-dialog.component.html',
  styleUrl: './split-unsure-match-dialog.component.css'
})
export class SplitUnsureMatchDialogComponent {

  public inProgress: boolean = false

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<SplitUnsureMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      callbackObservable: Observable<any>,
      returnError: boolean,
    }
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSplit() {
    this.inProgress = true;
    this.dataModel.callbackObservable.subscribe({
      next: () => {
      },
      error: e => {
        this.inProgress = false;
        if (this.dataModel.returnError) {
          this.dialogRef.close(e);
        } else {
          this.dialogRef.close();
          throw e;
        }
      },
      complete: () => {
        this.dialogRef.close(true);
        this.inProgress = false;
      }
    });
  }
}
