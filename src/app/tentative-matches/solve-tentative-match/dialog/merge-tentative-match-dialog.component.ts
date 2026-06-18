import { Component, OnInit } from '@angular/core';
import {
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-merge-tentative-match-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    TranslatePipe,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
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
