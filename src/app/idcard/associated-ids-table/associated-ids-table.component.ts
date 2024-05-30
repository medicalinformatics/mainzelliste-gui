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
  headers: {name: string, id: string, intOrExt: string}[] = [{name: "#", id: "index", intOrExt: ""}];

  @Input() data!: {idTypes: {name: string, id: string, isExternal: boolean}[] | undefined, group: AssociatedIdGroup};

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.fillElementData();
    this.dataSource = new MatTableDataSource(this.elementData);
    this.setupIdTypes();
  }

  fillElementData() {
    if (this.data != undefined && this.data.idTypes != undefined) {
      this.displayedColumns = ["index"].concat(this.data.idTypes.map(id => id.id));
      for (let y = 0; y < this.data.group.associatedIds.length; y++) {
        let associatedId = this.data.group.associatedIds[y];
        let tempIds: string[] = [(y + 1).toString()];
        for (let x = 0; x < associatedId.idTypes.length; x++) {
          for (let i = 0; i < this.data.idTypes!.length; i++) {
            if (associatedId.idTypes[x].idType === this.data.idTypes![i].id) {
              tempIds[i+1] = associatedId.idTypes[x].idString;
            }
          }
        }
        this.elementData.push({ids: tempIds});
      }
    }
  }

  setupIdTypes() {
    if (this.data != undefined && this.data.idTypes != undefined) {
      this.data.idTypes.forEach(idType => {
        let temp = idType.isExternal ? "(ext)" : "(int)";
        this.headers.push({name: idType.name, id: idType.id, intOrExt: temp});
      });
    }
  }
}

export interface Element {
  ids: string[];
}
