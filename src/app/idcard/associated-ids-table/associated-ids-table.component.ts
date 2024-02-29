import {Component, Input, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AssociatedIdGroup } from 'src/app/model/associated-id-group';

@Component({
    selector: 'associated-ids-table',
    templateUrl: 'associated-ids-table.component.html',
})

export class AssociatedIdsTableComponent implements OnInit {

  elementData: Element[] = [];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Element>;

  @Input() data!: {idTypes: {name: string, id: string, isExternal: boolean}[] | undefined, group: AssociatedIdGroup};

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.fillElementData();
    this.dataSource = new MatTableDataSource(this.elementData);
  }

  fillElementData() {
    if (this.data != undefined && this.data.idTypes != undefined) {
      this.displayedColumns = this.data.idTypes.map(id => id.id);
      this.data.group.associatedIds.forEach(associatedId => {
        let tempIds: string[] = [];
        for (let x = 0; x < associatedId.idTypes.length; x++) {
          for (let i = 0; i < this.data.idTypes!.length; i++) {
            if (associatedId.idTypes[x].idType === this.data.idTypes![i].id) {
              tempIds[i] = associatedId.idTypes[x].idString;
            }
          }
        }
        this.elementData.push({ids: tempIds});
      });
    } else {
      
    }
  }

}

export interface Element {
  ids: string[];
}
