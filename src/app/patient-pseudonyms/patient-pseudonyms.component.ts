import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PatientListService} from "../services/patient-list.service";

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css']
})

export class PatientPseudonymsComponent{
  private patientListService: PatientListService;
  @Input() pseudonyms: Array<{ idType: string, idString: string }>=[];
  @Input() readOnly: boolean= false;
  @Input() side: string="none";

  @Output() slideFieldEvent = new EventEmitter<{name:string,value:string}>();
  @Output() pseudonymEvent = new EventEmitter<{name:string,value:string}>();
  @Input()  fields: {[key: string]: any} = {};


  constructor(patientListService: PatientListService) {
    this.patientListService = patientListService;
  }

  fieldChanged(){
    // this.pseudonymEvent.emit(this.pseudonyms);

  }



  slideData(value: string, name: string): void{
    this.slideFieldEvent.emit({value:value, name:name});
  };


}
