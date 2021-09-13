import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterComponent} from "../filter/filter.component";
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";


@Component({
  selector: 'app-patientenliste',
  templateUrl: './patientenliste.component.html',
  styleUrls: ['./patientenliste.component.css']
})


export class PatientenlisteComponent {
  title = "Patientenliste";
  patientService: PatientService;
  data: Promise<Array<Patient>>;
  tmpPatient: Patient = new Patient();
  fields: Array<string> = ["Nachname", "Geburtsname", "Vorname", "Geburtsdatum", "Wohnort", "PLZ"];
  filterChoice: Array<string>=[];

  constructor(public dialog: MatDialog, patientService: PatientService) {
    this.patientService = patientService;
    this.data = patientService.getPatients();
  }

  openfilter(spalte: string) {
    console.log("opened filter");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (spalte == 'pseudonymfilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '11%'}});
    } else if (spalte == 'nachnamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '21%'}});
    } else if (spalte == 'geburtsnamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '31%'}});
    } else if (spalte == 'vornamefilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '41%'}});
    } else if (spalte == 'geburtsdatumfilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '53%'}});
    } else if (spalte == 'wohnortfilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '63%'}});
    } else if (spalte == 'plzfilter') {
      this.dialog.open(FilterComponent, {position: {top: '16.5%', left: '75%'}});
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
}
