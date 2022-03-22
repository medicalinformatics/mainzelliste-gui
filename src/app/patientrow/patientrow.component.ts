import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: '[app-patientrow]',
  templateUrl: './patientrow.component.html',
  styleUrls: ['./patientrow.component.css'],
})

export class PatientrowComponent {
  patientService: PatientService;
  @Input() patient: Patient = new Patient()
  @Input() fields : Array<string> = [];
  @Output() selectedP = new EventEmitter<PatientrowComponent>();

  show = true;
  editMode: boolean = false;
  deleteMode: boolean = false;
  selected: boolean = false;

  constructor(private route: ActivatedRoute, patientService: PatientService) {
    this.patientService = patientService;
  }

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.patient.ids[0] = params['id'];

    })
  }

  editPatientenZeile() {
    this.editMode=!this.editMode;
  }

  deletePatientenZeile(){
    this.patientService.deletePatient(this.patient).then((result) => {
      if (result == 204) {
        // TODO: What should happen here? This component will not survice the deletePatient call ...
      }
    });
  }

  selectPatient() {
    console.log("pushing one patient in chosenArray")
    this.selected=!this.selected;
    this.selectedP.emit(this);
    console.log(this);
  }

/*  GotoIDCard(){
    var patientId = 1;
    this.route.navigate(['/idcard', patientId])
  }*/

}
