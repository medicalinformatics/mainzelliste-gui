import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Id} from "../../model/id";

@Component({
  selector: 'new-id-dialog',
  templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Map<string, Id[]>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      externalId: Id,
      resultIdType: string
    }
  ) {
  }

  ngOnInit(): void {
  }

  getIdTypes() {
    return [...this.data.keys()];
  }

  getExternalIds(): Id[] {
    return this.data.get(this.dataModel.resultIdType) || [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.dataModel);
  }
}
