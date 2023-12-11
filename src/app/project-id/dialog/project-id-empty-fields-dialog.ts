import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'project-id-empty-fields-dialog',
    templateUrl: 'project-id-empty-fields-dialog.html',
})

export class ProjectIdEmptyFieldsDialog {

    constructor(
        public dialogRef: MatDialogRef<ProjectIdEmptyFieldsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: number
    ) {}

    onClose(): void {
      this.dialogRef.close();
    }
  }