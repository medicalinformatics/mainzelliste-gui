import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'consent-inactivated-dialog',
  templateUrl: 'consent-inactivated-dialog.html',
})
export class ConsentInactivatedDialog {
  constructor(
    public dialogRef: MatDialogRef<ConsentInactivatedDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
