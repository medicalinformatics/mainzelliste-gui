import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorDialogService {
  private opened = false;
  private config: MatDialogConfig = {
    data: {
      messages: [],
      status: 0,
    },
    maxHeight: '100%',
    maxWidth: '100%',
    width: '550px',
    hasBackdrop: true,
  }

  constructor(private dialog: MatDialog) {
  }

  openDialog(message: string): void {
    if (!this.opened) {
      this.opened = true;
      this.config.data.messages = [message];
      const dialogRef = this.dialog.open(ErrorDialogComponent, this.config);

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
        this.config.data.messages = [];
      });
    } else {
      // add new error to dialog
      this.config.data.messages.push(message);
    }
  }
}
