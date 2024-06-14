import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'delete-consent-dialog',
  templateUrl: 'delete-consent-dialog.html',
})
export class DeleteConsentDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConsentDialog>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
