import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Id} from "../../model/id";
import {Observable} from "rxjs";
import { PatientListService } from 'src/app/services/patient-list.service';

@Component({
  selector: 'new-id-dialog',
  templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog {
  public inProgress: boolean = false
  public externalId: Id = new Id("", "")
  public resultIdType: string = ""
  public resultIdValue: string = ""

  constructor(
    public dialogRef: MatDialogRef<NewIdDialog>,
    public patientlist: PatientListService,
    @Inject(MAT_DIALOG_DATA) public data: {
      relatedAssociatedIdsMap : Map<string, Id[]>,
      generateIdObservable: (externalId: Id, newIdType: string, newIdValue:string) => Observable<[{idType: string, idString: string}]>
    }
  ) {
  }

  getIdTypes() {
    return [...this.data.relatedAssociatedIdsMap.keys()];
  }

  getExternalIds(): Id[] {
    return this.data.relatedAssociatedIdsMap.get(this.resultIdType) || [];
  }

  // Check for external associated Ids
  isWriteableExternalAssociatedId(idType: string): boolean {
    return this.patientlist.getAssociatedIdTypes(true, "C").some(id => id = idType);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.data.generateIdObservable(this.externalId, this.resultIdType, this.resultIdValue).subscribe({
      next: () => {},
      error: e => {
        this.dialogRef.close(false);
        this.inProgress = false;
        throw e;
      },
      complete: () => {
        this.dialogRef.close(true);
        this.inProgress = false;
      }
    });
  }
}
