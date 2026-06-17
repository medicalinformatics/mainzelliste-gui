import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import {Id} from "../../../../model/id";
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-generate-id-dialog',
    templateUrl: './generate-id-dialog.component.html',
    styleUrls: ['./generate-id-dialog.component.css'],
    imports: [MatDialogTitle, FormsModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, MatDialogActions, MatButton, TranslatePipe]
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
