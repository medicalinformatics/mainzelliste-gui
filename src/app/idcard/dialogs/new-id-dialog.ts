import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Id} from "../../model/id";
import {Observable} from "rxjs";
import {IdType} from "../../model/id-type";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'new-id-dialog',
  templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog {
  public inProgress: boolean = false
  public externalId: Id = new Id("", "")
  public resultIdType: IdType = {name:"unkown", isExternal:false, isAssociated:false};
  public resultIdString: string = ""

  constructor(
    public dialogRef: MatDialogRef<NewIdDialog>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: {
      relatedAssociatedIdsMap : Map<IdType, Id[]>,
      generateIdObservable: (externalId: Id, newIdType: string, newIdValue:string) => Observable<[{idType: string, idString: string}]>
    }
  ) {
  }

  getIdTypes() {
    return [...this.data.relatedAssociatedIdsMap.keys()];
  }

  getRelatedAssociatedIds(): Id[] {
    return this.data.relatedAssociatedIdsMap.get(this.resultIdType) || [];
  }

  // Check for external associated Ids
  isExternalIdType(idType: string): boolean {
    return false;
    // return this.patientlist.getAssociatedIdTypes(true, "C").some(id => id = idType);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.data.generateIdObservable(this.externalId, this.resultIdType.name, this.resultIdString).subscribe({
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

  getText1() {
    return this.translate.instant(this.resultIdType.isExternal ? 'newIdDialog.text_1_b' : 'newIdDialog.text_1_a');
  }
}
