import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-identity-dialog',
  templateUrl: './secondary-identities-dialog.component.html',
})
export class IdentityDialogComponent {
  secondaryIdentities: any;
  public idType: string = "";
  public idString: string = "";

  constructor(
    public dialogRef: MatDialogRef<IdentityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idString: string, idType: string }
  ) {
    this.idString = data.idString;
    this.idType = data.idType;
  }

  showIdentitiesCard() {
    return true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
