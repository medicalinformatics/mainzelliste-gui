import {Component, Input, ViewChild} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {PatientListService} from "../services/patient-list.service";
import {MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {ConsentDialogComponent} from "../consent-dialog/consent-dialog.component";
import {ConsentService} from "../consent.service";
import {Consent} from "../model/consent";

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
  consent?: Consent;

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
    if(this.consent){
      this.consent.patientId = newId;
      await this.consentService.addConsent(this.consent);
    }
    await this.router.navigate(["/idcard", newId.idType, newId.idString]);
  }


  fieldsChanged(newFields: {[p: string]: any}) {
    this.patient.fields = newFields;
  }

  sendBanner($event: any) {

  }

  openConsentDialog() {
    const dialogRef = this.dialog.open(ConsentDialogComponent, {
      width: '900px',
      data: this.consent
    });

    dialogRef.afterClosed().subscribe(result => {
      this.consent = result;
    });
  }
}

export class AddPatientFormularComponent {
}
