import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'new-associated-id-dialog',
    templateUrl: 'new-associated-id-dialog.html',
})

export class NewAssociatedIdDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<NewAssociatedIdDialog>,
        @Inject(MAT_DIALOG_DATA) public dataModel: string
    ) {this.dataModel = ""}

    ngOnInit(): void {}

    onCancel(): void {
      this.dialogRef.close();
    }
  
    onSave() {
      this.dialogRef.close(this.dataModel);
    }
  }