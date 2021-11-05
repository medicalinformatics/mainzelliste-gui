import {Component, Input, OnInit} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientFieldsComponent} from "../patient-fields/patient-fields.component";
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent implements OnInit {
  title="Patient einfügen";
  patient: Patient;
  patientService: PatientService;
  @Input() fields : Array<string> = [];


  constructor(patientService: PatientService) {
    this.patientService= patientService;
    this.patient = new Patient();
  }

  ngOnInit(): void {
  }

  createNewPatient () {
    this.patientService.createPatient(this.patient).then((result) => {
      if (result == 200) {
        this.patient = new Patient();
      }
    });
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
    console.log("new Field");

  }

  sendBanner($event: any) {
    
  }
}
