import { Component, OnInit, Input } from '@angular/core';
import {Patient} from "../model/patient";

@Component({
  selector: '[app-patientenzeile]',
  templateUrl: './patientenzeile.component.html',
  styleUrls: ['./patientenzeile.component.css']
})
export class PatientenzeileComponent {
  @Input() patient: Patient = new Patient()
  @Input() fields : Array<string> = [];
  show = true;
  editMode: boolean = false;
  deleteMode: boolean = false;

  editPatientenZeile() {
    this.editMode=!this.editMode;
  }

  deletePatientenZeile(){

  }
}
