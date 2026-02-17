import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'bulk-id-generation-empty-fields-dialog',
    templateUrl: 'bulk-id-generation-empty-fields-dialog.html',
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})

export class BulkIdGenerationEmptyFieldsDialog implements OnInit {

    public text_one: string = "";
    public text_two: string = "";

    constructor(
        private translate: TranslateService,
        public dialogRef: MatDialogRef<BulkIdGenerationEmptyFieldsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: [number, boolean]
    ) {}

    ngOnInit(): void {
      if(this.data[1]) {
        this.text_one = this.translate.instant('bulkIdGenerationEmptyFieldsDialog.error_text1');
        this.text_two = this.translate.instant('bulkIdGenerationEmptyFieldsDialog.error_text2');
      } else {
        this.text_one = this.data[0] + this.translate.instant('bulkIdGenerationEmptyFieldsDialog.text1');
        this.text_two = this.translate.instant('bulkIdGenerationEmptyFieldsDialog.text2');
      }
    }

    onClose(): void {
      this.dialogRef.close();
    }
  }
