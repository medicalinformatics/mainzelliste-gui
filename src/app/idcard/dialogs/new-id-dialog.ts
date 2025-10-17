import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {Id} from "../../model/id";
import {Observable} from "rxjs";
import { PatientListService } from 'src/app/services/patient-list.service';

@Component({
  selector: 'new-id-dialog',
  templateUrl: 'new-id-dialog.html',
})

export class NewIdDialog implements OnInit {
  public inProgress: boolean = false;
  public externalId: Id = new Id("", "");
  public resultIdType: string = "";
  public manualIdInput: string = "";
  public resultExtIdString: string = "";

  constructor(
    private patientListService: PatientListService,
    public dialogRef: MatDialogRef<NewIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      relatedAssociatedIdsMap : Map<string, Id[]>,
      generateIdObservable: (externalId: Id, newIdType: string, resultExtIdString: string) => Observable<[{idType: string, idString: string}]>
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

  getExternalIdTypes(): string[] {
    return this.patientListService.getAllExternalIdTypes()
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.inProgress = true;
    this.data.generateIdObservable(this.externalId, this.resultIdType, this.resultExtIdString).subscribe({
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

  public isExternalIdType(idType: string): boolean {
    return this.getExternalIdTypes().includes(idType);
  }
}
