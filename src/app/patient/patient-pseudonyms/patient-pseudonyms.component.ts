import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PatientListService} from "../../services/patient-list.service";
import {IdTypSelection} from "../create-patient/create-patient.component";
import {ControlContainer, NgForm} from "@angular/forms";
import {Id} from "../../model/id";
import {ExternalPseudonymsComponent} from "../external-pseudonyms/external-pseudonyms.component";
import {Operation} from "../../model/patientlist";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PatientPseudonymsComponent{
  private patientListService: PatientListService;
  @Input() ids: Array<Id> = [];

  @Input() fields: { [key: string]: any } = {};
  @Input() readOnly: boolean = false;
  @Input() side: string = "none";
  @Input() permittedOperation?: Operation;

  @Output() slideFieldEvent = new EventEmitter<{ name: string, value: string }>();
  @Output() pseudonymEvent = new EventEmitter<{ name: string, value: string }>();

  @ViewChild(ExternalPseudonymsComponent) externalPseudonymsComponent!: ExternalPseudonymsComponent

  internalIdTypes: IdTypSelection[] = [];
  externalIdTypes: string[] = [];

  constructor(patientListService: PatientListService) {
    this.patientListService = patientListService;
  }

  slideData(value: string, name: string): void {
    this.slideFieldEvent.emit({value: value, name: name});
  }

  getInternalIdTypes(): IdTypSelection[] {
    if (this.internalIdTypes.length == 0) {
      //init.
      this.internalIdTypes = this.patientListService.getIdGenerators("R")
      .filter(g => !g.isExternal)
      .map(g => {
        return {idType: g.idType, added: false}
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
      this.externalIdTypes = this.patientListService.getIdGenerators("R")
      .filter(g => g.isExternal)
      .map(g => g.idType);
    }
    return this.externalIdTypes;
  }

  getExternalIds(): Id[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some(idType => idType == id.idType)
    );
  }
}
