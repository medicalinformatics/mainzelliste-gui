import {Component, Input, OnInit} from '@angular/core';
import {Patient} from "../../model/patient";
import {PatientService} from "../../services/patient.service";
import {GlobalTitleService} from "../../services/global-title.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-merge-patients',
  templateUrl: './mergePatients.component.html',
  styleUrls: ['./mergePatients.component.css']
})
export class MergePatientsComponent implements OnInit {
  patientService: PatientService;
  patients: Array<Patient> = [];

  @Input() patient: Patient = new Patient()
  @Input() fields : Array<string> = [];

  @Input() finalPatient= new Patient;
  emptyPatient= new Patient;

  constructor(
      public translate: TranslateService,
      patientService: PatientService,
      private titleService: GlobalTitleService
  ) {
    this.patientService = patientService;
    this.emptyPatient.ids = [{idType: "Pseudonym", idString: " ", tentative: false}];
    this.titleService.setTitle(this.translate.instant('mergePatients.title'), false, "merge_type");
  }

  ngOnInit(): void {
    this.patients = history.state.patients;
  }

  updateFieldsOfFinalPatient(name:string, value:string){
    this.finalPatient.fields[name]= value;
  }

  updatePseudonymOfFinalPatient (name:string, value: string){
    // this.finalPatient.ids[name]=value;
  }

  mergePatients() {
    // TODO: Needs Backend Implementation
  }
}
