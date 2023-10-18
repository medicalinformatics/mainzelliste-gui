import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, } from "@angular/material/dialog";
import { IdcardComponent } from '../idcard.component';


@Component({
    selector: 'new-id-dialog',
    templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog implements OnInit {

    @ViewChild(IdcardComponent) newId!: IdcardComponent;

    constructor(
        public dialogRef: MatDialogRef<NewIdDialog>,
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