import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'consent-rejected-dialog',
  templateUrl: 'consent-rejected-dialog.html',
})
export class ConsentRejectedDialog {
  constructor(
    public dialogRef: MatDialogRef<ConsentRejectedDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
