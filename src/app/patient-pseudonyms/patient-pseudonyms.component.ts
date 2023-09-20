import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PatientListService} from "../services/patient-list.service";
import {IdTypSelection} from "../createPatient/createPatient.component";
import {ControlContainer, NgForm} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {addIfNotExist} from "../utils/array-utils";
import {Id} from "../model/id";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PatientPseudonymsComponent implements OnChanges{
  private patientListService: PatientListService;
  @Input() ids: Array<Id> = [];

  @Input() fields: { [key: string]: any } = {};
  @Input() readOnly: boolean = false;
  @Input() side: string = "none";

  @Output() slideFieldEvent = new EventEmitter<{ name: string, value: string }>();
  @Output() pseudonymEvent = new EventEmitter<{ name: string, value: string }>();

  internalIdTypes: IdTypSelection[] = [];
  externalIdTypes: IdTypSelection[] = [];

  constructor(patientListService: PatientListService) {
    this.patientListService = patientListService;
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes["ids"]
    if(change.currentValue != undefined && change.currentValue.length > 0)
      this.getExternalIdTypes()
      .filter( e => change.currentValue.some( (id: any) => e.idType == id.idType))
      .forEach(e => e.added = true);

  }

  slideData(value: string, name: string): void {
    this.slideFieldEvent.emit({value: value, name: name});
  }

  addExternalIdField(selectedExternalIdType: MatSelect) {
    //add external id to patient model
    addIfNotExist(new Id(selectedExternalIdType.value, ''), this.ids, e => e.idType == selectedExternalIdType.value);

    this.externalIdTypes.filter( t => t.idType == selectedExternalIdType.value )
    .forEach( t => t.added = true);
    selectedExternalIdType.value = undefined
  }

  removeExternalIdField(idType: string) {
    this.ids.filter(id => id.idType == idType).forEach(id => id.idString = "");

    this.externalIdTypes.filter( t => t.idType == idType)
    .forEach( t => t.added = false);
  }

  disableAddExternalIdField(selectedExternalIdType: MatSelect): boolean {
    return selectedExternalIdType.value == undefined || selectedExternalIdType.value.length < 1;
  }

  getInternalIdTypes(): IdTypSelection[] {
    if (this.internalIdTypes.length == 0) {
      //init.
      this.internalIdTypes = this.patientListService.getIdGenerators()
      .filter(g => !g.isExternal)
      .map(g => {
        return {idType: g.idType, added: false}
      });
    }
    return this.internalIdTypes;
  }

  getInternalIds(): Id[] {
    this.getInternalIdTypes();
    return this.ids.filter(id => this.getInternalIdTypes().some(t => t.idType == id.idType))
  }

  getExternalIdTypes(): IdTypSelection[] {
    //init.
    if (this.externalIdTypes.length == 0) {
      this.externalIdTypes = this.patientListService.getIdGenerators()
      .filter(g => g.isExternal)
      .map(g => {
        return {idType: g.idType, added: false}
      });
    }
    return this.externalIdTypes;
  }

  getExternalIdMatSelectData(): string[] {
    return this.getExternalIdTypes().filter( t => !t.added).map( t => t.idType);
  }

  /**
   * get patient external ids
   */
  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some( t => t.idType == id.idType && t.added)
    );
  }
}
