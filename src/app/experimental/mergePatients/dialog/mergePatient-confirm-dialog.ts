import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import type { DialogProps } from "@mui/material";

@Component({
    selector: 'mergePatient-confirm-dialog',
    templateUrl: 'mergePatient-confirm-dialog.html',
  })
  export class MergePatientConfirmDialog {
    constructor(
      public dialogRef: MatDialogRef<MergePatientConfirmDialog>,
      @Inject(MAT_DIALOG_DATA) public data: { mainPatient: number, isDelete: boolean }
    ) {
    }
  
    cancel(isDelete: boolean): void {
      const handleClose: DialogProps["onClose"] = (event: any, reason: string) => {
        if (reason && reason === "backdropClick") {
          this.dialogRef.close({ isDelete: isDelete, confirm: false });
          return;
        }
      }
      this.dialogRef.close({ isDelete: isDelete, confirm: true });
  
    }
  }
  