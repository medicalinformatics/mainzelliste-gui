import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'delete-patient-dialog',
  templateUrl: 'delete-patient-dialog.html',
})
export class DeletePatientDialog {
  constructor(
    public dialogRef: MatDialogRef<DeletePatientDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
