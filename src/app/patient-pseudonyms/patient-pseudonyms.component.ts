import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css']
})

export class PatientPseudonymsComponent{
  @Input() pseudonyms: Array<{ idType: string, idString: string }>=[];
  @Input() readOnly: boolean= false;
  @Input() side: string="none";

  @Output() slideFieldEvent = new EventEmitter<{name:string,value:string}>();
  @Output() pseudonymEvent = new EventEmitter<{name:string,value:string}>();
  @Input()  fields: {[key: string]: any} = {};

  //TODO patientlist.service hier aufrufen
  constructor() {

  }

  fieldChanged(){
    // this.pseudonymEvent.emit(this.pseudonyms);

  }

  slideData(value: string, name: string): void{
    this.slideFieldEvent.emit({value:value, name:name});
  };


}
