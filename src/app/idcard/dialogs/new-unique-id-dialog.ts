import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Id} from "../../model/id";

@Component({
    selector: 'new-unique-id-dialog',
    templateUrl: 'new-unique-id-dialog.html',
})

export class NewUniqueIdDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewUniqueIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Map<string, Id[]>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      idType: string,
      idString: string,
      resultIdType: string
    }
  ) {
  }

    
  ngOnInit(): void {}

  getIdTypes() {
    return [ ... this.data.keys()];
  }
  
  getExternalIds(): Id[] {
    return this.data.get(this.dataModel.resultIdType) || [];
  }
  
  idTypeSelected(selectedIdType: string) {
    if (this.dataModel != undefined) {
      this.dataModel.resultIdType = selectedIdType;
    } else {
      this.dataModel = {idType: "", idString: "", resultIdType: selectedIdType}
    }
  }
  
  selectExternalId(selectedId: { idType: string, idString: string, resultIdType: string }) {
    if (this.dataModel != undefined) {
      this.dataModel.idType = selectedId.idType;
      this.dataModel.idString = selectedId.idString;
    } else {
      this.dataModel = {
        idType: selectedId.idType,
        idString: selectedId.idString,
        resultIdType: ""
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSave() {
    this.dialogRef.close(this.dataModel);
  }
}