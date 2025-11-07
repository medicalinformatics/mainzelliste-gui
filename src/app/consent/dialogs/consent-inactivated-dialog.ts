import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'consent-inactivated-dialog',
  templateUrl: 'consent-inactivated-dialog.html',
})
export class ConsentInactivatedDialog {
  public inProgress: boolean = false
  constructor(
    public dialogRef: MatDialogRef<ConsentInactivatedDialog>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      updateConsentObservable: Observable<any>
    }
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.dataModel.updateConsentObservable.subscribe({
      next: () => {},
      error: e => {
        this.dialogRef.close();
        this.inProgress = false;
      },
      complete: () => {
        this.dialogRef.close();
        this.inProgress = false;
      }
    });
  }
}
