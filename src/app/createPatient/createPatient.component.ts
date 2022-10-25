import {Component, Input} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent {
  title="Patient einfügen";
  patient: Patient;
  @Input() fields : Array<string> = [];


  dataControll = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  //


  constructor(
    private patientService: PatientService,
    private router: Router
  ) {
    this.patient = new Patient();
  }

  createNewPatient () {
    this.patientService.createPatient(this.patient).then(patient => {
      this.router.navigate(["/idcard"], {state: {patient: patient[0]}}).then(success => {
        console.log("successfully navigated to idcard")
      }).catch(error => {
        console.log("Can't navigate to idcard because of error.")
        console.log(error)
      })
    });
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
    console.log("new Field");

  }

  sendBanner($event: any) {

  }

/* consentChanged(newField: boolean) {
    this.patient.consent = newField;
    console.log("Consent given:" +this.patient.consent);
  }*/
}

export class AddPatientFormularComponent {
}
