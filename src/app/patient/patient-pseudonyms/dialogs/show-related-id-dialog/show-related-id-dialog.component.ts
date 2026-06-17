import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import {Id} from "../../../../model/id";
import { NgClass, NgFor } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-show-related-id-dialog',
    templateUrl: './show-related-id-dialog.component.html',
    styleUrls: ['./show-related-id-dialog.component.css'],
    imports: [MatDialogTitle, NgClass, NgFor, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatDialogActions, MatButton, TranslatePipe]
})
export class ShowRelatedIdDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowRelatedIdDialog>,
    @Inject(MAT_DIALOG_DATA) public ids: Id[]) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }
}
