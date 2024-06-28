import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CompactAssociatedIdsDialog } from 'src/app/idcard/dialogs/compact-associated-ids-dialog';
import { AssociatedIdGroup } from 'src/app/model/associated-id-group';
import { Patient } from 'src/app/model/patient';
import { PatientListService } from 'src/app/services/patient-list.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-associated-ids',
  templateUrl: './patient-associated-ids.component.html',
  styleUrls: ['./patient-associated-ids.component.css']
})

export class PatientAssociatedIdsComponent implements OnInit {

  @Input() patient!: Patient;
  @Input() readOnly: boolean= false;

  group: AssociatedIdGroup | undefined;
  tableData: {name: string, id: string, isExternal: boolean}[] | undefined;
  dataModel!: AssociatedIdGroup;
  elementData: Element[] = [];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Element>;
  headers: {name: string, id: string, intOrExt: string}[] = [{name: "#", id: "index", intOrExt: ""}];

  constructor(
    private patientListService: PatientListService,
    private patientService: PatientService,
    public associatedIdsDialog: MatDialog,
  ) { }

  onGroupChange() {
    this.tableData = this.patientListService.getAssociatedIdTypes(this.dataModel.name);
    this.group = this.dataModel;
    this.fillElementData();
    this.dataSource = new MatTableDataSource(this.elementData);
    this.setupIdTypes();
  }

  ngOnInit(): void {
    
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

  openCompactAssociatedIdsDialog() {
    const dialogRef = this.associatedIdsDialog.open(CompactAssociatedIdsDialog, {
        panelClass: 'my-dialog',
        data: {patient: this.patient, idTypes: this.patientListService.getAssociatedIdTypes(this.dataModel.name), group: this.dataModel}
      });

      dialogRef.afterClosed().subscribe(result => {

      });
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

