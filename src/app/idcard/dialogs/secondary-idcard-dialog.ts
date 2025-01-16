import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'secodary-idcard-dialog',
  templateUrl: 'secondary-idcard-dialog.html',
})
export class SecondaryIDCardDialog {
  constructor(
    public dialogRef: MatDialogRef<SecondaryIDCardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { idType: string, idString: string, showSecondary:boolean }
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
