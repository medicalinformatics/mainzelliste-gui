import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientListService} from "../services/patient-list.service";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import FhirConsent from "../../assets/fhirConsent.json";


@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})

export class ConsentComponent implements OnInit {

  title = FhirConsent.extension[1].valueString;
  date = FhirConsent.dateTime;
  provisionFirst = FhirConsent.provision.provision[0].code[0].coding[0].display;
  patient: Patient = new Patient();
  foods: any[] = [
    {value: '2.16.840.1.113883.3.1937.777.24.2.1790', viewValue: '1.6d: 2.16.840.1.113883.3.1937.777.24.2.1790'},
    {value: '2.16.840.1.113883.3.1937.777.24.2.1791', viewValue: '1.6f: 2.16.840.1.113883.3.1937.777.24.2.1791'},
    {value: '2.16.840.1.113883.3.1937.777.24.2.2079', viewValue: '1.7.2: 2.16.840.1.113883.3.1937.777.24.2.2079'},
  ];

  constructor(
    private patientListService: PatientListService,
    private patientService: PatientService,
    private router: Router,
  ) {
 }

  ngOnInit(): void {
    this.patient = history.state.patient;
  }

}



