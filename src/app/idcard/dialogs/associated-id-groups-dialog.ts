import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AssociatedIdGroup } from "src/app/model/associated-id-group";

@Component({
    selector: 'associated-id-groups-dialog',
    templateUrl: 'associated-id-groups-dialog.html',
})

export class AssociatedIdGroupsDialog implements OnInit {
  
    constructor(
        public dialogRef: MatDialogRef<AssociatedIdGroupsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: AssociatedIdGroup[],
      ) {}

    ngOnInit(): void {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(group: AssociatedIdGroup) {
        this.dialogRef.close(group);
    }
}