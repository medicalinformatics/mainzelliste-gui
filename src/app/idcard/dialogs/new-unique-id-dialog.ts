import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, } from "@angular/material/dialog";
import { IdcardComponent } from '../idcard.component';


@Component({
    selector: 'new-unique-id-dialog',
    templateUrl: 'new-unique-id-dialog.html',
})

export class NewUniqueIdDialog implements OnInit {

    @ViewChild(IdcardComponent) newId!: IdcardComponent;

    constructor(
        public dialogRef: MatDialogRef<NewUniqueIdDialog>,
        @Inject(MAT_DIALOG_DATA) public data: String[],
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