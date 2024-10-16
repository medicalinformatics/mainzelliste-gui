import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'project-id-empty-fields-dialog',
    templateUrl: 'project-id-empty-fields-dialog.html',
})

export class ProjectIdEmptyFieldsDialog implements OnInit {

    public text_one: string = "";
    public text_two: string = "";

    constructor(
        private translate: TranslateService,
        public dialogRef: MatDialogRef<ProjectIdEmptyFieldsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: [number, boolean]
    ) {}

    ngOnInit(): void {
      if(this.data[1]) {
        this.text_one = this.translate.instant('projectIdEmptyFieldsDialog.error_text1');
        this.text_two = this.translate.instant('projectIdEmptyFieldsDialog.error_text2');
      } else {
        this.text_one = this.data[0] + this.translate.instant('projectIdEmptyFieldsDialog.text1');
        this.text_two = this.translate.instant('projectIdEmptyFieldsDialog.text2');
      }
    }

    onClose(): void {
      this.dialogRef.close();
    }
  }