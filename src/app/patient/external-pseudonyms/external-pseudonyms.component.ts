import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Id} from "../../model/id";
import {IdTypSelection} from "../create-patient/create-patient.component";
import {MatSelect} from "@angular/material/select";
import {addIfNotExist, removeFrom} from "../../utils/array-utils";
import {PatientListService} from "../../services/patient-list.service";
import {ControlContainer, NgForm} from "@angular/forms";
import {AppConfigService} from "../../app-config.service";
import {Operation} from "../../model/tenant";

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

  externalIdTypes: IdTypSelection[] = [];

  constructor(
    private patientListService: PatientListService,
    public config: AppConfigService
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
    addIfNotExist(new Id(selectedExternalIdType.value, ''), this.ids, e => e.idType == selectedExternalIdType.value);

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
      this.externalIdTypes = this.patientListService.getIdGenerators(this.permittedOperation)
      .filter(g => g.isExternal)
      .map(g => {
        return {idType: g.idType, added: false}
      });
    }
    return this.externalIdTypes;
  }

  getExternalIdMatSelectData(): string[] {
    return this.getExternalIdTypes().filter(t => !t.added).map(t => t.idType);
  }

  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some(t => t.idType == id.idType && t.added)
    );
  }

  public getConcatenated(id: Id): string {
    return id.idType + "." + id.idString;
  }
}
