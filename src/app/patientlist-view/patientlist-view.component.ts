import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {Patient} from "../model/patient";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {PatientListService} from "../services/patient-list.service";
import {FieldFilter, Filter, SimilarPatientFilter} from "../model/filter";

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
  // addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA] as const;
  filterCtrl = new FormControl();

  filters: Filter[] = [];


  filterEingabe: string | undefined;
  allFieldsToSearch: Array <string>=['Pseudonym', 'Nachname', 'Geburtsname', 'Vorname', 'Geburtsdatum', 'PLZ', 'Wohnort'];

  selectedCriteria:any;
  allPatientsToSearch: Array <string>=[];


  @ViewChild('fruitInput')
  filterInput!: ElementRef<HTMLInputElement>;

  // SIMILAR PATIENT FEATURE
  similarPatientActive: boolean = true;

  @ViewChild('similarP')
  similarP!: ElementRef<HTMLInputElement>;

  patientlistService: PatientListService;


  constructor(patientService: PatientService, patientListService: PatientListService) {
    this.patientService = patientService;
    this.patientlistService = patientListService;
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || '').trim();

    if (value) {
      console.log("here we are");
     let filter= new FieldFilter(JSON.parse(event.value));
      this.filters.push(filter);
      this.patientService.getPatients(this.filters);
    }
    event.chipInput!.clear();
  }

  remove(filter: any): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.patientService.getPatients(this.filters);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.value);
    this.selectedCriteria=(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.patientService.getPatients(this.filters);
  }

  selectedSP(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.value);
    this.selectedCriteria=(event.option.value);
    this.similarP.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.patientService.getPatients(this.filters);
  }

  patientSelected(selectedPatients: Patient[]) {
    this.selectedPatients = selectedPatients;
  }

  ngOnInit(): void {
    this.patientService.getPatients(this.filters);

  }

  activateSimilarPatientSearch(sPatient: Patient){
      this.filters.push(new SimilarPatientFilter(sPatient));
      this.similarPatientActive = true;

  }

  closeSimilarPatientSearch() {
    this.similarPatientActive = false;
  }
}
