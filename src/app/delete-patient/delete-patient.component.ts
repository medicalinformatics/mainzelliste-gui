import { Component, OnInit } from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Id, PatientListService} from "../services/patient-list.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-delete-patient',
  templateUrl: './delete-patient.component.html',
  styleUrls: ['./delete-patient.component.css']
})

export class DeletePatientComponent implements OnInit {

  patient: Patient = new Patient();
  private idString: string = "";
  private idType: string = "";


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private patientListService: PatientListService,
              private patientService:PatientService
  ){

  activatedRoute.params.subscribe((params) => {
      console.log(this.idType, this.idString); // kommt hier nicht rein
      if (params["idType"] !== undefined)
        this.idType = params["idType"]
      if (params["idString"] !== undefined)
        this.idString = params["idString"]
    })
  }

  ngOnInit() {
    this.patientListService.readPatient(new Id(this.idType, this.idString)).then(patients => {
      this.patient = this.patientListService.convertToDisplayPatient(patients[0]);
    });
  }

  async deletePatientenZeile(){
    await this.patientService.deletePatient(this.patient);
    this.router.navigate(['/patientlist']);

  }

}
