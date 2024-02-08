import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { IdcardComponent } from '../idcard.component';


@Component({
    selector: 'new-id-dialog',
    templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog implements OnInit {


  constructor(
      public dialogRef: MatDialogRef<NewIdDialog>,
      @Inject(MAT_DIALOG_DATA) public data: IdcardComponent 
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSave(x: number) {
    this.dialogRef.close(x);
  }
}