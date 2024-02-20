import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Id } from 'src/app/model/id';


@Component({
    selector: 'new-associated-id-dialog',
    templateUrl: 'new-associated-id-dialog.html',
})

export class NewAssociatedIdDialog implements OnInit {

    public externalIds: {name: string, id: string}[] = [];
    public internalIds: {name: string, id: string}[] = [];
    public idType: any[] = [];
    public idString: string;

    constructor(
      public dialogRef: MatDialogRef<NewAssociatedIdDialog>,
      @Inject(MAT_DIALOG_DATA) public data: {
        name: string;
        id: string;
        isExternal: boolean;
      }[],
    ) {
      this.idString = "";
      this.idType[0] = null;
      this.idType[1] = null;
      this.splitIds();
    }

    splitIds() {
      this.data.forEach(id => {
        if (id.isExternal) {
          this.externalIds.push({name: id.name, id: id.id});
        } else {
          this.internalIds.push({name: id.name, id: id.id});
        }
      });
    }

    ngOnInit(): void {}

    onCancel(): void {
      this.dialogRef.close();
    }

    onSave() {
      if(this.idType[1] != null || this.idString !== "") {
        this.dialogRef.close({intId: this.idType[0].value, extId: new Id(this.idType[1].value, this.idString)});
      } else {
        this.dialogRef.close({intId: this.idType[0].value, extId: undefined});
      }
    }
  }