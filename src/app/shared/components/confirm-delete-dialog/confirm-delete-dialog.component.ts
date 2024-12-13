import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent {

  public message: string = "";
  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      itemI18nName: string,
    }
  ) {
    this.message = translate.instant("confirm_delete_dialog.text").replace("${1}",
      translate.instant(dataModel.itemI18nName))
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
