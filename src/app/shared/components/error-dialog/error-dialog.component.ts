import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.css'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgFor, TranslatePipe]
})
export class ErrorDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { messages: string[]; status?: number }
  ) {
  }
}
