import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PatientListService} from "../services/patient-list.service";
import {IdTypSelection} from "../createPatient/createPatient.component";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css']
})

export class PatientPseudonymsComponent {
  private patientListService: PatientListService;
  @Input() ids: Array<{ idType: string, idString: string }> = [];

  @Input() fields: { [key: string]: any } = {};
  @Input() readOnly: boolean = false;
  @Input() side: string = "none";

  @Output() slideFieldEvent = new EventEmitter<{ name: string, value: string }>();
  @Output() pseudonymEvent = new EventEmitter<{ name: string, value: string }>();

  externalIdTypesFormControl = new FormControl('');

  internalIdTypes: IdTypSelection[] = [];
  externalIdTypes: string[] = [];
  deletedExternalIds: string[] = [];

  constructor(patientListService: PatientListService) {
    this.patientListService = patientListService;
  }

  slideData(value: string, name: string): void {
    this.slideFieldEvent.emit({value: value, name: name});
  }

  addExternalIdField() {
    //add external id to patient model
    this.ids.push({idType: this.externalIdTypesFormControl.value, idString: ''})

    let index = this.deletedExternalIds.findIndex(idType => idType == this.externalIdTypesFormControl.value);
    if (index > -1) {
      this.deletedExternalIds.splice(index, 1);
    }
  }

  removeExternalIdField(idType: string) {
    this.ids.filter(id => id.idType == idType).forEach(id => id.idString = "");
    this.deletedExternalIds.push(idType);
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

  getInternalIds(): { idType: string, idString: string }[] {
    this.getInternalIdTypes();
    return this.ids.filter(id => this.getInternalIdTypes().some(t => t.idType == id.idType))
  }

  getExternalIdTypes(): string[] {
    //init.
    if (this.externalIdTypes.length == 0) {
      this.externalIdTypes = this.patientListService.getIdGenerators()
      .filter(g => g.isExternal)
      .map(g =>  g.idType);
    }
    return this.externalIdTypes;
  }

  getExternalIdMatSelectData(): string[] {
    return this.getExternalIdTypes().filter(idType => !this.ids.some( id => id.idType == idType)
      || this.deletedExternalIds.some(idType => idType == idType));
  }

  /**
   * get patient external ids
   */
  getExternalIds(): { idType: string, idString: string }[] {
    return this.ids.filter(id =>
      this.getExternalIdTypes().some( idType => idType == id.idType)
      && !this.deletedExternalIds.some(idType => idType == id.idType)
    );
  }
}
