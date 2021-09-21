import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent implements OnInit {
  title="Patient einfügen";

  constructor() {

  }

  ngOnInit(): void {
  }

}
