import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {
  SecondaryIdentitiesComponent
} from "../../../shared/components/secondary-identities/secondary-identities.component";
import {MatButton} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-identity-dialog',
  templateUrl: './secondary-identities-dialog.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    SecondaryIdentitiesComponent,
    MatDialogActions,
    MatButton,
    TranslatePipe
  ]
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
