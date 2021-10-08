import {Component, OnInit} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {PatientlistComponent} from "../patientlist/patientlist.component";
import {FieldService} from "../services/field.service";
import {Field} from "../model/field";
import {count} from "rxjs/operators";

@Component({
  selector: 'app-patientlist-view',
  templateUrl: './patientlist-view.component.html',
  styleUrls: ['./patientlist-view.component.css']
})
export class PatientlistViewComponent implements OnInit {
  title = "Patientenliste";
  patientService: PatientService;
  patient: Patient = new Patient();
  fields: Array<string> = [];
  selectedPatients: Array<Patient> = [];

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Array<any> = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];

  mySearchInput = [{name: 'Nachname'}
  ];
  mySearchSection = [
    {name: 'Nachname'},
    {name: 'Geburtsname'},
    {name: 'Vorname'},
    {name: 'Geburtsdatum'},
    {name: 'PLZ'},
    {name: 'Wohnort'},
  ];

  /*
     elems = document.querySelectorAll('.mat-checkbox');
     btn = document.querySelector('.PatientenansichtButton');
     [].forEach.call(elems, function(el)){
     el.addEventListener('change', function(){
       checked = document.querySelectorAll('.mat-checkbox:checked');
       if(checked.length){
         btn.style.backgroundColor = 'green';
       }else{
         btn.style.backgroundColor = '';
       }
    })}
     }
  */

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }


  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

  patientSelected(list: PatientlistComponent) {
    this.selectedPatients = list.selectedPatients;
  }
}
