import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {PatientlistComponent} from "../patientlist/patientlist.component";
import {Observable} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {FieldService} from "../services/field.service";

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
  patients: Promise <Array<Patient>>;

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA] as const;
  filterCtrl = new FormControl();

  filters:Array <{field:string,searchCriteria:string}> = [];

  filterEingabe: string | undefined;
  allFieldsToSearch: Array <string>=['Pseudonym', 'Nachname', 'Geburtsname', 'Vorname', 'Geburtsdatum', 'PLZ', 'Wohnort'];

  selectedCriteria:any;
  allPatientsToSearch: Array <string>=[];


  @ViewChild('fruitInput')
  filterInput!: ElementRef<HTMLInputElement>;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
    this.patients = patientService.getPatients(this.filters);
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      console.log("here we are");
     let filter:{ field: string, searchCriteria: string } = JSON.parse(event.value);
      this.filters.push(filter);
      this.patients=this.patientService.getPatients(this.filters);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(filter: any): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.patients=this.patientService.getPatients(this.filters);

    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.value);
    this.selectedCriteria=(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.patients=this.patientService.getPatients(this.filters);
  }

  patientSelected(selectedPatients: Patient[]) {
    this.selectedPatients = selectedPatients;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

  searchforFilter():void{
    let filteredData = this.patientService.patients.map(function (p) {
      //search for filterToSearch arguments in Patientlist
      return p.fields.toString()
    });
  }
}
