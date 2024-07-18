import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Id} from "../../model/id";
import {IdTypSelection} from "../create-patient/create-patient.component";
import {MatSelect} from "@angular/material/select";
import {addIfNotExist, removeFrom} from "../../utils/array-utils";
import {PatientListService} from "../../services/patient-list.service";
import {ControlContainer, NgForm} from "@angular/forms";
import {AppConfigService} from "../../app-config.service";
import {Operation} from "../../model/tenant";
import {MatDialog} from "@angular/material/dialog";
import {GenerateIdDialog} from "./dialogs/generate-id/generate-id-dialog.component";

@Component({
  selector: 'app-external-pseudonyms',
  templateUrl: './external-pseudonyms.component.html',
  styleUrls: ['./external-pseudonyms.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ExternalPseudonymsComponent implements OnChanges {

  @Input() ids: Array<Id> = [];
  @Input() readOnly: boolean = false;
  @Input() removeEmptyId: boolean = false;
  @Input() side: string = "none";
  @Input() permittedOperation?: Operation;
  @Output() generateId = new EventEmitter<{idType:string, idString:string, newIdType: string}>();

  externalIdTypes: IdTypSelection[] = [];
  associatedIdTypeMap: Map<Id, string[]> = new Map();

  constructor(
    private patientListService: PatientListService,
    public config: AppConfigService,
    public generateIdDialog: MatDialog
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes["ids"]
    if (change.currentValue != undefined && change.currentValue.length > 0)
      this.getExternalIdTypes()
      .filter(e => change.currentValue.some((id: any) => e.idType == id.idType))
      .forEach(e => e.added = true);

  }

  addExternalIdField(selectedExternalIdType: MatSelect) {
    //add external id to patient model
    addIfNotExist(new Id(selectedExternalIdType.value, ''), this.ids,
        e => !this.isAssociatedIdType(selectedExternalIdType.value) && e.idType == selectedExternalIdType.value
    );

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

  disableAddExternalIdField(selectedExternalIdType: MatSelect): boolean {
    return selectedExternalIdType.value == undefined || selectedExternalIdType.value.length < 1;
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
    return this.getExternalIdTypes().filter(t => this.isAssociatedIdType(t.idType) || !t.added).map(t => t.idType);
  }

  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some(t => t.idType == id.idType && t.added)
    );
  }

  isAssociatedIdType(idType: string){
    return this.getExternalIdTypes().some( t => t.idType == idType && t.associated)
  }

  public getConcatenated(id: Id): string {
    return id.idType + "." + id.idString;
  }

  getAssociatedIdTypes():Map<Id, string[]> {
    if(this.associatedIdTypeMap.size == 0)
      this.associatedIdTypeMap = this.patientListService.getAssociatedIdTypeMapFrom(this.getExternalIds(), false, "C");
    return this.associatedIdTypeMap;
  }

  openGenerateIdDialog(externalId:Id, idTypes:string[]): void {
    const dialogRef = this.generateIdDialog.open(GenerateIdDialog, {
      data: {
        externalId: externalId,
        idTypes: idTypes
      },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(idType => {
      if (idType != null && this.generateId != undefined) {
        this.generateId.emit({idType: externalId.idType, idString: externalId.idString, newIdType: idType});
      }
    })
  }
}
