import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PatientSearchComponent} from "../patientSearch/patientSearch.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {PatientrowComponent} from "../patientrow/patientrow.component";

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})

export class PatientlistComponent {
  title = "Patientenliste";
  patientService: PatientService;
  data: Promise<Array<Patient>>;
  tmpPatient: Patient = new Patient();
  fields: Array<string> = ["Nachname", "Geburtsname", "Vorname", "Geburtsdatum", "Wohnort", "PLZ"];
  filterChoice: Array<string>=[];

  @Output() selectedP = new EventEmitter<PatientlistComponent>();
  selectedPatients: Array<Patient> = [];

  constructor(public dialog: MatDialog, patientService: PatientService) {
    this.patientService = patientService;
    this.data = patientService.getPatients();
  }

  openfilter(spalte: string) {
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'pseudonymfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '11%'}});
    } else if (spalte == 'nachnamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '21%'}});
    } else if (spalte == 'geburtsnamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '31%'}});
    } else if (spalte == 'vornamefilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '41%'}});
    } else if (spalte == 'geburtsdatumfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '53%'}});
    } else if (spalte == 'wohnortfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '63%'}});
    } else if (spalte == 'plzfilter') {
      this.dialog.open(PatientSearchComponent, {position: {top: '16.5%', left: '75%'}});
    }
  }

  erstelleNeuenPatienten () {
    this.patientService.createPatient(this.tmpPatient).then((result) => {
      if (result == 200) {
        this.tmpPatient = new Patient();
      }
    });
  }

  useFilter(filterWahl:string){
    this.filterChoice.push(filterWahl);
  }

  patientSelected(row: PatientrowComponent){
    this.selectedPatients.push(row.patient);
    this.selectedP.emit(this);

  }
}
