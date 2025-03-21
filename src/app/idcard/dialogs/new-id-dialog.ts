import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Id} from "../../model/id";
import {Observable} from "rxjs";

@Component({
  selector: 'new-id-dialog',
  templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog implements OnInit {
  public inProgress: boolean = false
  public externalId: Id = new Id("", "")
  public resultIdType: string = ""

  constructor(
    public dialogRef: MatDialogRef<NewIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      relatedAssociatedIdsMap : Map<string, Id[]>,
      generateIdObservable: (externalId: Id, newIdType: string) => Observable<[{idType: string, idString: string}]>
    }
  ) {
  }

  ngOnInit(): void {
  }

  getIdTypes() {
    return [...this.data.relatedAssociatedIdsMap.keys()];
  }

  getExternalIds(): Id[] {
    return this.data.relatedAssociatedIdsMap.get(this.resultIdType) || [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.data.generateIdObservable(this.externalId, this.resultIdType).subscribe({
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
