import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AssociatedIdGroup } from "src/app/model/associated-id-group";
import { Id } from "src/app/model/id";
import { Patient } from "src/app/model/patient";
import { PatientListService } from "src/app/services/patient-list.service";
import { PatientService } from "src/app/services/patient.service";

@Component({
    selector: 'associated-ids-dialog',
    templateUrl: 'associated-ids-dialog.html',
    styleUrls: ['./associated-ids-dialog.css']
})

export class AssociatedIdsDialog implements OnInit {

    step: number = 0;
    tableData!: {idTypes: {name: string, id: string, isExternal: boolean}[] | undefined, group: AssociatedIdGroup};
    isLinear: boolean = true;
    externalIds: {name: string, id: string}[] = [{name: "-", id: "-"}];
    internalIds: {name: string, id: string}[] = [];
    idType: any[] = [null, null];
    idString: string = "";
    canGenerate: boolean = false;
  
    constructor(
        public dialogRef: MatDialogRef<AssociatedIdsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {patientListService: PatientListService, patientService: PatientService, patient: Patient},
        @Inject(MAT_DIALOG_DATA) public dataModel: AssociatedIdGroup,
      ) {}

    setupTable(): void {
        this.tableData = {idTypes: this.data.patientListService.getAssociatedIdTypes(this.dataModel.name), group: this.dataModel}
    }

    addId() {
        if(this.idType[1] != null && this.idString !== "") {
          this.addNewAssociatedId(this.dataModel, this.idType[0].value, new Id(this.idType[1].value, this.idString));
        } else {
          this.addNewAssociatedId(this.dataModel, this.idType[0].value, undefined);
        }
      }

    addNewAssociatedId(group: AssociatedIdGroup, intIdType: string, extId?: Id): boolean {
        if (extId != undefined) {
          if (!this.data.patient.idExists(extId?.idString)) {
            this.data.patientService.addNewAssociatedId(group, intIdType, this.generateNewIntId(), extId);
            return true;
          }
          return false;
        } else {
          this.data.patientService.addNewAssociatedId(group, intIdType, this.generateNewIntId());
          return true;
        }
      }

    private generateNewIntId(): string {
        let x: number = 0;
        while (this.data.patient.idExists(x.toString())) {
          x++;
        }
        return x.toString();
    }

    generate() {
        if (this.data.patientListService.getAssociatedIdTypes(this.dataModel.name) != undefined) {
            this.splitIds(this.data.patientListService.getAssociatedIdTypes(this.dataModel.name)!);
            this.canGenerate = true;
        } else {
            this.canGenerate = false;
        }
    }

    toSecondStep() {
        this.step = 1;
        this.canGenerate = false;
        this.externalIds = [{name: "-", id: "-"}];
        this.internalIds = [];
        this.idType = [null, null];
        this.idString = "";
    }
    
    splitIds(ids: {
        name: string;
        id: string;
        isExternal: boolean;
    }[]) {
        ids.forEach(id => {
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
        this.dialogRef.close();
    }
}