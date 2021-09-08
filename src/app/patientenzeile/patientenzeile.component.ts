import { Component, OnInit, Input } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";

@Component({
  selector: '[app-patientenzeile]',
  templateUrl: './patientenzeile.component.html',
  styleUrls: ['./patientenzeile.component.css']
})
export class PatientenzeileComponent {
  patientService: PatientService;
  @Input() patient: Patient = new Patient()
  @Input() fields : Array<string> = [];
  show = true;
  editMode: boolean = false;
  deleteMode: boolean = false;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
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
}
