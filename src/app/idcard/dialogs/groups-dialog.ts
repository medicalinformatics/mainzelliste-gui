import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { AssociatedIdGroup } from 'src/app/model/associated-id-group';
import { Patient } from 'src/app/model/patient';


@Component({
    selector: 'groups-dialog',
    templateUrl: 'groups-dialog.html',
})

export class GroupsDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<GroupsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Patient,
    ) {}

    ngOnInit(): void {
      this.dialogRef.updateSize('80%', '90%');
    }

    onClose(group: AssociatedIdGroup) {
      this.dialogRef.close(group);
    }

    onCancel(): void {
      this.dialogRef.close();
    }
  }