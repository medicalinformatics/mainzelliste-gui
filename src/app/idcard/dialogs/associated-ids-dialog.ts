import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { AssociatedIdGroup } from 'src/app/model/associated-id-group';

@Component({
    selector: 'associated-ids-dialog',
    templateUrl: 'associated-ids-dialog.html',
})

export class AssociatedIdsDialog implements OnInit {

  elementData: Element[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<Element>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    public dialogRef: MatDialogRef<AssociatedIdsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {idTypes: {name: string, id: string, isExternal: boolean}[], group: AssociatedIdGroup}
  ) {
    this.fillElementData();
    this.displayedColumns = data.idTypes.map(id => id.id);
    this.dataSource = new MatTableDataSource(this.elementData);
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSave(result: string) {
    this.dialogRef.close(result);
  }

  fillElementData() {
    this.data.group.associatedIds.forEach(associatedId => {
      let tempIds: string[] = [];
      for (let x = 0; x < associatedId.idTypes.length; x++) {
        for (let i = 0; i < this.data.idTypes.length; i++) {
          if (associatedId.idTypes[x].idType === this.data.idTypes[i].id) {
            tempIds[i] = associatedId.idTypes[x].idString;
          }
        }
      }
      this.elementData.push({ids: tempIds});
    });
  }
}

export interface Element {
  ids: string[];
}
