import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-patient-pseudonyms',
  templateUrl: './patient-pseudonyms.component.html',
  styleUrls: ['./patient-pseudonyms.component.css']
})

export class PatientPseudonymsComponent{
  @Input() pseudonyms: Array<{ idType: string, idString: string }>=[];
  @Input() readOnly: boolean= false;

  constructor() {
  }

}
