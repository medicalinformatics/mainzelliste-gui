import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Id} from "../../../../model/id";

@Component({
  selector: 'app-generate-id-dialog',
  templateUrl: './generate-id-dialog.component.html',
  styleUrls: ['./generate-id-dialog.component.css']
})
export class GenerateIdDialog implements OnInit {

  public selectedIdType?: string

  constructor(
    public dialogRef: MatDialogRef<GenerateIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      externalId: Id,
      idTypes: string[]
    }) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.selectedIdType);
  }
}
