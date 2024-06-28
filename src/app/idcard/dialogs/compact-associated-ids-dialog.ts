import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatInput } from "@angular/material/input";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AssociatedId } from "src/app/model/associated-id";
import { AssociatedIdGroup } from "src/app/model/associated-id-group";
import { Id } from "src/app/model/id";
import { Patient } from "src/app/model/patient";
import { PatientService } from "src/app/services/patient.service";

export interface IdSelection {
  id: {name: string, id: string},
  added: boolean,
}

@Component({
    selector: 'compact-associated-ids-dialog',
    templateUrl: 'compact-associated-ids-dialog.html',
    styleUrls: ['./compact-associated-ids-dialog.css']
})

export class CompactAssociatedIdsDialog implements OnInit {

    externalIds: {name: string, id: string}[] = [{name: "-", id: "-"}];
    internalIds: {name: string, id: string}[] = [];

    @ViewChild('chipList') chipList!: MatChipList;
    @ViewChild('input') input!: MatInput;

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
    generatedId!: AssociatedId;
  
    constructor(
        public translate: TranslateService,
        public dialogRef: MatDialogRef<CompactAssociatedIdsDialog>,
        private patientService: PatientService,
        @Inject(MAT_DIALOG_DATA) public data: {patient: Patient, idTypes: {name: string, id: string, isExternal: boolean}[] | undefined, group: AssociatedIdGroup}
      ) {}

    addId() {
        if(this.idType != null && this.idString !== "") {
          this.addNewAssociatedId(this.data.group, this.selectedInternalIds.map(id => id.id), new Id(this.idType.value, this.idString));
        } else {
          this.addNewAssociatedId(this.data.group, this.selectedInternalIds.map(id => id.id), undefined);
        }
      }

    addNewAssociatedId(group: AssociatedIdGroup, intIdTypes: string[], extId?: Id): boolean {
      if (extId != undefined) {
          if (!this.data.patient.idExists(extId?.idString)) {
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
        while (this.data.patient.idExists(x.toString())) {
          x++;
        }
        return (x + this.temp).toString();
    }

    generate() {
      if (this.data.idTypes != undefined) {
        this.splitIds(this.data.idTypes);
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

    // removes all chips currently selected in the chipList
    /*removeAllChips() {
      this.removeInternalId(this.selectedInternalIds);
    }*/

    removeInternalId(id: {name: string, id: string}[]) {
      for (let x = 0; 0 < id.length; x++) {
        const value = (id[0].id || '').trim();
  
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
      this.generate();
    }

    onClose(): void {
        this.dialogRef.close();
    }
}