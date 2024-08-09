import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PatientListService} from "../../services/patient-list.service";
import {IdTypSelection} from "../create-patient/create-patient.component";
import {ControlContainer, NgForm} from "@angular/forms";
import {Id} from "../../model/id";
import {ExternalPseudonymsComponent} from "../external-pseudonyms/external-pseudonyms.component";
import {AppConfigService} from "../../app-config.service";
import {Operation} from "../../model/tenant";
import {MatDialog} from "@angular/material/dialog";
import {
  ShowRelatedIdDialog
} from "./dialogs/show-related-id-dialog/show-related-id-dialog.component";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PatientPseudonymsComponent{
  @Input() ids: Array<Id> = [];

  @Input() fields: { [key: string]: any } = {};
  @Input() readOnly: boolean = false;
  @Input() side: string = "none";
  @Input() permittedOperation?: Operation;

  @Output() slideFieldEvent = new EventEmitter<{ name: string, value: string }>();
  @Output() generateId = new EventEmitter<{idType:string, idString:string, newIdType: string}>();

  @ViewChild(ExternalPseudonymsComponent) externalPseudonymsComponent!: ExternalPseudonymsComponent

  internalIdTypes: IdTypSelection[] = [];
  externalIdTypes: string[] = [];

  constructor(
    private patientListService: PatientListService,
    public config: AppConfigService,
    public showRelatedIdDialog: MatDialog
  ) {
  }

  slideData(value: string, name: string): void {
    this.slideFieldEvent.emit({value: value, name: name});
  }

  getInternalIdTypes(): IdTypSelection[] {
    if (this.internalIdTypes.length == 0) {
      //init.
      this.internalIdTypes = this.patientListService.getAllInternalIdTypes("R")
      .map(t => {
        return {idType: t, added: false}
      });
    }
    return this.internalIdTypes;
  }

  getInternalIds(): Id[] {
    return this.ids.filter(id => this.getInternalIdTypes().some(t => t.idType == id.idType))
  }

  getExternalIdTypes(): string[] {
    //init.
    if (this.externalIdTypes.length == 0) {
      this.externalIdTypes = this.patientListService.getAllExternalIdTypes(this.permittedOperation);
    }
    return this.externalIdTypes;
  }

  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some(idType => idType == id.idType)
    );
  }

  public getConcatenated(id: Id): string {
    return id.idType + "." + id.idString;
  }

  forwardGenerateIdEvent(event: { idType: string, idString: string, newIdType: string }) {
    this.generateId.emit({
      idType: event.idType,
      idString: event.idString,
      newIdType: event.newIdType
    });
  }

  openRelatedDialog(id: Id) {
    this.patientListService.findRelatedIds(id, this.ids).subscribe( ids => this.showRelatedIdDialog.open(ShowRelatedIdDialog, {
      data: ids,
      disableClose: true,
      minWidth: 300
    }))
  }
}
