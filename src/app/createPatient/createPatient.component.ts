import {Component, Input, ViewChild} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {PatientListService} from "../services/patient-list.service";
import {MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {ConsentDialogComponent} from "../consent-dialog/consent-dialog.component";
import {ConsentModel} from "../consentModel";
import {ConsentService} from "../consent.service";

@Component({
  selector: 'app-create-patient',
  templateUrl: './createPatient.component.html',
  styleUrls: ['./createPatient.component.css']
})
export class CreatePatientComponent {
  title="Patient einfügen";
  @Input() fields : Array<string> = [];
  @ViewChild("pseudonymSelection") pseudonymSelection!: MatSelect;

  dataControll = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  patientListPseudonyms: Promise<string[]>;

  patient:Patient = new Patient();
  patientService: PatientService;
  patientListService: PatientListService;
  consentModel?: ConsentModel;

  constructor(
    public dialog: MatDialog,
    patientService: PatientService,
    patientListService: PatientListService,
    private consentService: ConsentService,
    private router: Router
  ) {
    this.patientService = patientService;
    this.patientListService = patientListService;
    this.patientListPseudonyms=patientListService.getPatientListIdTypes();
  }

  async createNewPatient () {
    console.log(this.pseudonymSelection);
    let newId = await this.patientService.createPatient(this.patient, this.pseudonymSelection.value);
    await this.router.navigate(["/idcard", newId.idType, newId.idString]);
    if(this.consentModel){
      this.consentModel.patientId = newId;
      await this.consentService.addConsent(this.consentModel);
    }
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  sendBanner($event: any) {

  }

/* consentChanged(newField: boolean) {
    this.patient.consent = newField;
    console.log("Consent given:" +this.patient.consent);
  }*/
  openDialog() {
    console.log("open dialog: " + this.consentModel);
    const dialogRef = this.dialog.open(ConsentDialogComponent, {
      width: '900px',
      data: this.consentModel
    });

    dialogRef.afterClosed().subscribe(result => {
      this.consentModel = result;
      console.log('The dialog was closed: ' + this.consentModel);
    });
  }
}

export class AddPatientFormularComponent {
}
