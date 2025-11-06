import {Component, Inject} from "@angular/core";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'consent-rejected-dialog',
  templateUrl: 'consent-rejected-dialog.html',
})
export class ConsentRejectedDialog {
  public inProgress: boolean = false
  constructor(
    public dialogRef: MatDialogRef<ConsentRejectedDialog>,
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
