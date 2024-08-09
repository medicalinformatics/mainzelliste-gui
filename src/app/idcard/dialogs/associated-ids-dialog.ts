import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AssociatedId } from "src/app/model/associated-id";
import { AssociatedIdGroup } from "src/app/model/associated-id-group";
import { Id } from "src/app/model/id";
import { Patient } from "src/app/model/patient";
import { PatientListService } from "src/app/services/patient-list.service";
import { PatientService } from "src/app/services/patient.service";

export interface IdSelection {
  id: {name: string, id: string},
  added: boolean,
}

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

    @ViewChild('chipList') chipList!: MatChipList;
    @ViewChild('intIdsForm') intIdsForm!: NgForm;

    /** selected chip data model */
    selectedInternalIds: {name: string, id: string}[] = [];
    /** autocomplete data model */
    filteredInternalIds: Observable<IdSelection[]> = of([]);
    chipListInputCtrl = new FormControl();
    chipListInputData: string = "";
    internalIdSelection: IdSelection[] = [];

    idType: any = null;
    idString: string = "";
    temp: number = 0;
    addIntIds: {idType: string, idString: string}[] = [];
    canGenerate: boolean = false;
    dataModel!: AssociatedIdGroup;
    generatedId!: AssociatedId;

  
    constructor(
        public translate: TranslateService,
        private patientListService: PatientListService,
        private patientService: PatientService,
        public dialogRef: MatDialogRef<AssociatedIdsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Patient
      ) {}

    setupTable(): void {
        this.tableData = {idTypes: this.patientListService.getAssociatedIdTypesByGroup(this.dataModel.name), group: this.dataModel}
    }

    addId() {
        if(this.idType != null && this.idString !== "") {
          this.addNewAssociatedId(this.dataModel, this.selectedInternalIds.map(id => id.id), new Id(this.idType.value, this.idString));
        } else {
          this.addNewAssociatedId(this.dataModel, this.selectedInternalIds.map(id => id.id), undefined);
        }
      }

    addNewAssociatedId(group: AssociatedIdGroup, intIdTypes: string[], extId?: Id): boolean {
      if (extId != undefined) {
          if (!this.data.idExists(extId?.idString)) {
            intIdTypes.forEach(idType => {
              let idString = this.generateNewIntId();
              this.temp++;
              this.addIntIds.push({idType: idType, idString: idString});
            });
            this.generatedId = this.patientService.addNewAssociatedId(group, this.addIntIds, extId);
            this.addIntIds = [];
            return true;
          }
          return false;
        } else {
          intIdTypes.forEach(idType => {
            let idString = this.generateNewIntId();
            this.temp++;
            this.addIntIds.push({idType: idType, idString: idString});
          });
          this.generatedId = this.patientService.addNewAssociatedId(group, this.addIntIds);
          this.addIntIds = [];
          return true;
        }
      }

    private generateNewIntId(): string {
        let x: number = 0;
        while (this.data.idExists(x.toString())) {
          x++;
        }
        return (x + this.temp).toString();
    }

    generate() {
        if (this.patientListService.getAssociatedIdTypesByGroup(this.dataModel.name) != undefined) {
            this.splitIds(this.patientListService.getAssociatedIdTypesByGroup(this.dataModel.name)!);
            this.canGenerate = true;
        } else {
            this.canGenerate = false;
        }
        this.filteredInternalIds = this.chipListInputCtrl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchValue = value;
            if (value == undefined)
              searchValue = "";
            else if (typeof searchValue !== "string")
              searchValue = value.id.id
            return this.internalIdSelection
            .filter(e => !e.added && e.id.id.toLowerCase().includes(searchValue.toLowerCase()))
          }),
        );
        this.internalIdSelection = this.internalIds
        .map(t => {
          return {id: t, added: false}
        });
    }

    toSecondStep() {
        this.step = 1;
        this.canGenerate = false;
        this.externalIds = [{name: "-", id: "-"}];
        this.internalIds = [];
        this.idType = null;
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

    removeAllChips() {
      this.selectedInternalIds.forEach(id => {
        this.removeInternalId(id);
      });
    }

    removeInternalId(id: {name: string, id: string}) {
      const value = (id.id || '').trim();
  
      this.internalIdSelection
      .filter(e => e.id.id == value)
      .forEach(e => {
        e.added = false;
      })
  
      // remove id type from selected id types
      let index = this.selectedInternalIds.findIndex(e => e.id == value);
      if (index > -1) {
        this.selectedInternalIds.splice(index, 1);
        this.chipList.errorState = this.selectedInternalIds.length == 0;
        this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
      }
    }

    findAndAddInternalId($event: MatChipInputEvent): void {
      const value = ($event.value || '').trim();
      if (value) {
        this.addInternalId(value);
      }
  
      // Clear the input value
      $event.chipInput!.clear();
    }

    private addInternalId(id: string) {
      let idSelection = this.findId(id);
      if (idSelection != undefined) {
        this.selectedInternalIds.push(idSelection.id);
        idSelection.added = true;
        this.chipListInputCtrl.setValue(null);
        this.chipList.errorState = false;
        this.chipListInputCtrl.updateValueAndValidity({onlySelf: false, emitEvent: true});
      }
    }

    selectedInternalId(event: MatAutocompleteSelectedEvent): void {
      this.addInternalId(event.option.value);
    }

    private findId(id: string): IdSelection | undefined {
      return this.internalIdSelection.find(e => e.id.id == id && !e.added);
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.dialogRef.close();
    }
}