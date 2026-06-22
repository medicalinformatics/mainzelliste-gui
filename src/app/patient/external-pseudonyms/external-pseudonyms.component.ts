import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Id} from "../../model/id";
import {IdTypSelection} from "../create-patient/create-patient.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {addIfNotExist, removeFrom} from "../../utils/array-utils";
import {PatientListService} from "../../services/patient-list.service";
import {ControlContainer, FormsModule, NgForm, NgModelGroup} from "@angular/forms";
import {AppConfigService} from "../../app-config.service";
import {Operation} from "../../model/tenant";
import {MatDialog} from "@angular/material/dialog";
import {GenerateIdDialog} from "./dialogs/generate-id/generate-id-dialog.component";
import {
  ShowRelatedIdDialog
} from "../patient-pseudonyms/dialogs/show-related-id-dialog/show-related-id-dialog.component";
import {NgFor, NgIf, NgStyle} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {first} from "rxjs";

@Component({
    selector: 'app-external-pseudonyms',
    templateUrl: './external-pseudonyms.component.html',
    styleUrls: ['./external-pseudonyms.component.css'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, NgFor, NgIf, NgStyle, MatIcon, MatFormField, MatLabel, MatInput, MatSuffix, MatIconButton, CdkCopyToClipboard, MatTooltip, MatSelect, MatOption, TranslatePipe]
})
export class ExternalPseudonymsComponent implements OnChanges {

  @Input() ids: Array<Id> = [];
  @Input() readOnly: boolean = false;
  @Input() removeEmptyId: boolean = false;
  @Input() side: string = "none";
  @Input() permittedOperation?: Operation;
  @Output() generateId = new EventEmitter<{idType:string, idString:string, newIdType: string}>();

  @ViewChild('externalIdsCtrl', { read: ElementRef }) extIdsList!: ElementRef;
  externalIdTypes: IdTypSelection[] = [];

  constructor(
    private patientListService: PatientListService,
    public config: AppConfigService,
    public generateIdDialog: MatDialog,
    public showRelatedIdDialog: MatDialog
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes["ids"]
    if (change.currentValue != undefined && change.currentValue.length > 0)
      this.getExternalIdTypes()
      .filter(e => change.currentValue.some((id: any) => e.idType == id.idType))
      .forEach(e => e.added = true);

  }

  addExternalIdField(selectedExternalIdType: MatSelect, externalIdsGroup: NgModelGroup) {
    const oldExternalIds = Object.entries(externalIdsGroup.control.controls).map(([key, value]) => key);
    //add external id to patient model
    addIfNotExist(new Id(selectedExternalIdType.value, ''), this.ids,
        e => !this.isAssociatedIdType(selectedExternalIdType.value) && e.idType == selectedExternalIdType.value
    );

    // change focus
    externalIdsGroup.control.valueChanges.pipe(first()).subscribe(v => {
      const controlId = Object.entries(v)
      .map(([k,o]) => k)
      .find(k => !oldExternalIds.includes(k));
      this.extIdsList.nativeElement.querySelector(`input[name="${controlId}"]`)?.focus();
  });

    this.externalIdTypes.filter(t => t.idType == selectedExternalIdType.value)
    .forEach(t => t.added = true);
    selectedExternalIdType.value = undefined
  }

  removeExternalIdField(idType: string) {
    if(this.removeEmptyId)
      removeFrom(id => id.idType == idType, this.ids);
    else
      this.ids.filter(id => id.idType == idType).forEach(id => id.idString = "");

    this.externalIdTypes.filter(t => t.idType == idType)
    .forEach(t => t.added = false);
  }

  getExternalIdTypes(): IdTypSelection[] {
    //init.
    if (this.externalIdTypes.length == 0) {
      this.externalIdTypes = [
        ...this.patientListService.getUniqueIdTypes(true, this.permittedOperation)
          .map(t => { return {idType: t, added: false, associated: false } }),
        ...this.patientListService.getAssociatedIdTypes(true, this.permittedOperation)
          .map(t => { return {idType: t, added: false, associated: true } })];
    }
    return this.externalIdTypes;
  }

  getExternalIdMatSelectData(): string[] {
    return this.getExternalIdTypes()
    .filter(t => t.associated && this.permittedOperation != 'U' || !t.associated && !t.added)
    .map(t => t.idType);
  }

  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some(t => t.idType == id.idType && (t.added || t.associated))
    );
  }

  isAssociatedIdType(idType: string){
    return this.getExternalIdTypes().some( t => t.idType == idType && t.associated)
  }

  public getConcatenated(id: Id): string {
    return id.idType + "." + id.idString;
  }

  getAssociatedIdTypes(idType: string):string[] {
    return this.patientListService.getRelatedAssociatedIdTypes(idType, false, "C");
  }

  openGenerateIdDialog(externalId:Id): void {
    const dialogRef = this.generateIdDialog.open(GenerateIdDialog, {
      data: {
        externalId: externalId,
        idTypes: this.getAssociatedIdTypes(externalId.idType)
      },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(idType => {
      if (idType != null && this.generateId != undefined) {
        this.generateId.emit({idType: externalId.idType, idString: externalId.idString, newIdType: idType});
      }
    })
  }
  openRelatedDialog(id: Id) {
    this.patientListService.findRelatedIds(id, this.ids).subscribe( ids => this.showRelatedIdDialog.open(ShowRelatedIdDialog, {
      data: ids,
      disableClose: true,
      minWidth: 300
    }))
  }

  getFieldName(key: Id) {
    return key.idType + this.ids.indexOf(key);
  }

  public getFieldClass(){
    return "inputField ml-field" + (this.readOnly ? " inputFieldDisabled" : "");
  }
}
