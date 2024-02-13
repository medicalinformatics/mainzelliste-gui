import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { AssociatedId } from 'src/app/model/associated-id';

@Component({
    selector: 'associated-ids-dialog',
    templateUrl: 'associated-ids-dialog.html',
})

export class AssociatedIdsDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AssociatedIdsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: AssociatedId[],
        @Inject(MAT_DIALOG_DATA) public dataModel: any
    ) {this.dataModel = null}

    ngOnInit(): void {}

    onCancel(): void {
      this.dialogRef.close();
    }
  
    onSave() {
      this.dialogRef.close("xdd");
    }
  }