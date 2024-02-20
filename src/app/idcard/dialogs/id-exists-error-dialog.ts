import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'id-exists-error-dialog',
    templateUrl: 'id-exists-error-dialog.html',
})

export class IdExistsErrorDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<IdExistsErrorDialog>
    ) {}

    ngOnInit(): void {}

    onCancel(): void {
      this.dialogRef.close();
    }
  }