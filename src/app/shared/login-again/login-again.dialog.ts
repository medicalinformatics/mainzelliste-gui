import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-again',
  templateUrl: './login-again.dialog.html',
  styleUrls: ['./login-again.dialog.css']
})
export class LoginAgainDialog {

  constructor(public dialogRef: MatDialogRef<LoginAgainDialog>) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
