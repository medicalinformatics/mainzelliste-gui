import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent {

  public message: string = "";
  public inProgress: boolean = false

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      itemI18nName: string,
      callbackObservable: Observable<any>,
      returnError: boolean,
    }
  ) {
    this.message = translate.instant("confirm_delete_dialog.text").replace("${0}",
      translate.instant(dataModel.itemI18nName))
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onDelete() {
    this.inProgress = true;
    this.dataModel.callbackObservable.subscribe({
      next: () => {},
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
