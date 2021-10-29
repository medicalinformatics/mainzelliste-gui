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
import {Field} from "../model/field";
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

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA] as const;
  fruitCtrl = new FormControl();
  searchedCriteria: Observable<string[]>;

  fruits: Array<string> = ['Vorname: Marie'];

  allPatientsToSearch: Array <string>=[];


  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
    this.allPatientsToSearch = this.patientService.patients.map(function (p){return p.fields.toString()});
    // this.fillSearchOptions();
    this.searchedCriteria = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((field: string | null) => field ? this._filter(field) : this.allPatientsToSearch.slice()));
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(event.value);
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPatientsToSearch.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  patientSelected(selectedPatients: Patient[]) {
    this.selectedPatients = selectedPatients;
  }

  ngOnInit(): void {
    this.patient = history.state.patient;
    this.fields = history.state.fields;
  }

  /*  fillSearchOptions() {
      for (let i = 0; i < this.exampleArray.length; i++) {
        console.log(this.exampleArray[i]);
        let x = this.exampleArray[i].fields.toString();

        for(let field in this.fields)
        let y = this.exampleArray[i].field.toString();

        this.allPatientsToSearch.push(x);
        this.allPatientsToSearch.push(y);
      }
    }*/

}
