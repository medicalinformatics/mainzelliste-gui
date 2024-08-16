import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AssociatedIdGroup } from 'src/app/model/associated-id-group';
import { Patient } from 'src/app/model/patient';
import { PatientListService } from 'src/app/services/patient-list.service';

@Component({
  selector: 'app-patient-associated-ids-table',
  templateUrl: './patient-associated-ids-table.component.html',
  styleUrls: ['./patient-associated-ids-table.component.css']
})

export class PatientAssociatedIdsTableComponent implements OnInit, AfterViewInit {

  @Input() patient?: Patient;
  @Input() group!: AssociatedIdGroup;
  @Input() readOnly: boolean= false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //group: AssociatedIdGroup | undefined;
  tableData: {name: string, id: string, isExternal: boolean}[] | undefined;
  dataModel!: AssociatedIdGroup;
  elementData: Element[] = [];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Element>;
  headers: {name: string, id: string, intOrExt: string}[] = [{name: "#", id: "index", intOrExt: ""}];

  constructor(
    private patientListService: PatientListService,
    public compactAssociatedIdsDialog: MatDialog,
  ) { }

  /*onGroupChange() {
    this.tableData = this.patientListService.getAssociatedIdTypesByGroup(this.dataModel.name);
    this.group = this.dataModel;
    this.fillElementData();
    this.dataSource = new MatTableDataSource(this.elementData);
    this.setupIdTypes();
  }*/
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.tableData = this.patientListService.getAssociatedIdTypesByGroup(this.group.name);
    this.fillElementData();
    this.setupIdTypes();
    if (this.elementData.length % 5 != 0) {
      this.appendEmptyElements(5 - (this.elementData.length % 5));
    }
    this.dataSource = new MatTableDataSource(this.elementData);
  }

  fillElementData() {
    this.elementData = [];
    if (this.tableData != undefined && this.group != undefined) {
      this.displayedColumns = ["index"].concat(this.tableData.map(id => id.id));
      for (let y = 0; y < this.group.associatedIds.length; y++) {
        let associatedId = this.group.associatedIds[y];
        let tempIds: string[] = [(y + 1).toString()];
        for (let x = 0; x < associatedId.idTypes.length; x++) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (associatedId.idTypes[x].idType === this.tableData[i].id) {
              tempIds[i+1] = associatedId.idTypes[x].idString;
            }
          }
        }
        tempIds[this.tableData.length + 1] = "";
        this.elementData.push({ids: tempIds});
      }
    }
  }

  appendEmptyElements(emptyRows: number) {
    for(let i = 0; i < emptyRows; i++) {
      let temp = new Array<string>(this.displayedColumns.length - 1);
      this.elementData.push({ids: temp});
    }
  }

  setupIdTypes() {
    this.headers = [{name: "#", id: "index", intOrExt: ""}];
    if (this.tableData != undefined) {
      this.tableData.forEach(idType => {
        let temp = idType.isExternal ? "(ext)" : "(int)";
        this.headers.push({name: idType.name, id: idType.id, intOrExt: temp});
      });
    }
  }
}

export interface Element {
  ids: string[];
}

