import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-merge-tentative-match-dialog',
  templateUrl: './merge-tentative-match-dialog.component.html'
})
export class MergeTentativeMatchDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MergeTentativeMatchDialogComponent>
  ) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
