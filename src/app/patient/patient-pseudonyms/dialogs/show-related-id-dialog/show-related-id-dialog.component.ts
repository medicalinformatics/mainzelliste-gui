import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Id} from "../../../../model/id";

@Component({
  selector: 'app-show-related-id-dialog',
  templateUrl: './show-related-id-dialog.component.html',
  styleUrls: ['./show-related-id-dialog.component.css']
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
