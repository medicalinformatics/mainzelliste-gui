import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import {Id} from "../../model/id";
import {Observable} from "rxjs";
import {IdType} from "../../model/id-type";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { NgModel, FormsModule } from "@angular/forms";
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { ValidRelatedExternalIdsDirective } from '../../shared/directives/valid-related-external-ids.directive';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'new-id-dialog',
    templateUrl: 'new-id-dialog.html',
    imports: [MatDialogTitle, FormsModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, NgIf, NgStyle, MatInput, ValidRelatedExternalIdsDirective, MatError, MatDialogActions, MatButton, MatIcon, MatProgressSpinner, TranslatePipe]
})

export class NewIdDialog {
  public inProgress: boolean = false
  public externalId: Id = new Id("", "")
  public resultIdType?: IdType;
  public resultIdString: string = ""

  constructor(
    public dialogRef: MatDialogRef<NewIdDialog>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: {
      patientIds: Id[],
      relatedAssociatedIdsMap : Map<IdType, Id[]>,
      generateIdObservable: (externalId: Id, newIdType: string, newIdValue:string) => Observable<[{idType: string, idString: string}]>
    }
  ) {
  }

  getIdTypes() {
    return [...this.data.relatedAssociatedIdsMap.keys()];
  }

  getRelatedAssociatedIds(): Id[] {
    return this.resultIdType ? this.data.relatedAssociatedIdsMap.get(this.resultIdType) || [] : [];
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
    this.data.generateIdObservable(this.externalId, this.resultIdType?.name || "", this.resultIdString).subscribe({
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
    return this.translate.instant(this.resultIdType?.isExternal ? 'newIdDialog.text_1_b' : 'newIdDialog.text_1_a');
  }

  displayError(field: NgModel) {
    return field.invalid && (field.dirty || field.touched) && field.errors?.idStringExist?.value;
  }
}
