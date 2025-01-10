import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-merge-tentative-dialog',
  templateUrl: './merge-tentative-dialog.component.html'
})
export class MergeTentativeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MergeTentativeDialogComponent>
  ) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
