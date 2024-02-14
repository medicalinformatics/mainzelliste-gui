import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { AssociatedId } from 'src/app/model/associated-id';

@Component({
    selector: 'associated-ids-dialog',
    templateUrl: 'associated-ids-dialog.html',
})

export class AssociatedIdsDialog implements OnInit {

  elementData: Element[] = [];
  displayedColumns = ['idType', 'intId', 'extId'];
  dataSource = new MatTableDataSource(this.elementData);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    public dialogRef: MatDialogRef<AssociatedIdsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AssociatedId[],
    @Inject(MAT_DIALOG_DATA) public dataModel: any
  ) {
    this.dataModel = null
    this.fillElementData();
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSave() {
    this.dialogRef.close("xdd");
  }

  fillElementData() {
    this.data.forEach(id => {
      this.elementData.push({idType: id.name, intId: id.internalId, extId: id.externalId});
    });
  }
}

export interface Element {
  idType: string;
  intId: string;
  extId: string;
}
