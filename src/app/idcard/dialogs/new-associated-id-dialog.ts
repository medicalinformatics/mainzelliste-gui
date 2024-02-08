import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { AssociatedIdsGenerator } from 'src/app/model/associated-ids-generator';


@Component({
    selector: 'new-associated-id-dialog',
    templateUrl: 'new-associated-id-dialog.html',
})

export class NewAssociatedIdDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<NewAssociatedIdDialog>,
        @Inject(MAT_DIALOG_DATA) public data: AssociatedIdsGenerator[],
        @Inject(MAT_DIALOG_DATA) public dataModel: any
    ) {this.dataModel = null}

    ngOnInit(): void {}

    onCancel(): void {
      this.dialogRef.close();
    }
  
    onSave() {
      this.dialogRef.close(this.dataModel);
    }
  }