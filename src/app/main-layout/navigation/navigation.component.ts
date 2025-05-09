import {Component} from '@angular/core';
import {Permission} from "../../model/permission";
import {AppConfigService} from "../../app-config.service";
import {AuthorizationService} from "../../services/authorization.service";
import {PatientListService} from "../../services/patient-list.service";
import {Id} from "../../model/id";
import {AddPatientRequest} from "../../model/add-patient-request";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  public readonly Permission = Permission;

  constructor(
      public appConfigService: AppConfigService,
      public authorizationService:AuthorizationService,
      public patientListService:PatientListService
  ) {
  }

  /**
   * TODO example: run bulk pseudonymization.
   */
  public bulkPseudonymize(){
    this.patientListService.addPatients([new AddPatientRequest({
      "vorname": "klmana",
      "nachname": "tiokma",
      "geburtstag": "01",
      "geburtsmonat": "01",
      "geburtsjahr": "1980"
    }, {"clinicExtId": "45878178718"})],["biobankId"], false)
    .subscribe(console.log)
  }
}

