import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
import {
  ShowRelatedIdDialog
} from "../patient-pseudonyms/dialogs/show-related-id-dialog/show-related-id-dialog.component";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-external-pseudonyms',
  templateUrl: './external-pseudonyms.component.html',
  styleUrls: ['./external-pseudonyms.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ExternalPseudonymsComponent implements OnInit, OnChanges {

  @Input() ids: Array<Id> = [];
  @Input() readOnly: boolean = false;
  @Input() removeEmptyId: boolean = false;
  @Input() side: string = "none";
  @Input() permittedOperation?: Operation;
  @Output() generateId = new EventEmitter<{idType:string, idString:string, newIdType: string}>();

  externalIdTypes: IdTypSelection[] = [];

  constructor(
    private patientListService: PatientListService,
    public config: AppConfigService,
    public generateIdDialog: MatDialog,
    public showRelatedIdDialog: MatDialog,
    private appConfigService: AppConfigService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    // initialize required external ids
    this.appConfigService.getRequiredExternalIds().map(requiredId => {
      addIfNotExist(new Id(requiredId, ""), this.ids,
        e => !this.isAssociatedIdType(requiredId) && e.idType == requiredId
      )
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes["ids"]
    if (change.currentValue != undefined && change.currentValue.length > 0)
      this.getExternalIdTypes()
      .filter(e => change.currentValue.some((id: any) => e.idType == id.idType))
      .forEach(e => e.added = true);
  }

  addExternalIdField(selectedExternalIdType: MatSelect) {
    this.addExternalIdFieldString(selectedExternalIdType.value)
    selectedExternalIdType.value = undefined
  }

  addExternalIdFieldString(idType: string) {
    //add external id to patient model
    addIfNotExist(new Id(idType, ''), this.ids,
        e => !this.isAssociatedIdType(idType) && e.idType == idType
    );

    this.externalIdTypes.filter(t => t.idType == idType)
    .forEach(t => t.added = true);
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
          .map(t => { return {
            idType: t,
            added: this.appConfigService.getRequiredExternalIds().some(id => id = t),
            associated: false
          } }),
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
    return id.idType + this.config.getCopyConcatenateSeparation() + id.idString;
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

  public getFieldClass(className: string){
    return className + (this.readOnly ? " inputFieldDisabled" : "");
  }

  isRequired(idType: string) {
    return this.appConfigService.getRequiredExternalIds().some(type => type === idType);
  }
}
