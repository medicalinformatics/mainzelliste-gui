import { GlobalTitleService } from "../../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/model/patient';
import { PatientListService } from 'src/app/services/patient-list.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Field } from 'src/app/model/field';
import { Component, Input, OnInit, } from '@angular/core';
import { Permission } from "../../model/permission";
//patient: ['biobankId', 'Vorname', 'Nachname', 'Geburtsname', 'Geburtdatum', 'Wohnort', 'PLZ', 'actions']
const DATASOURCE: { patient: Patient, tentativeMatch: Patient }[] = [
  {
    patient: new Patient({ "Nachname": "Müller", "Vorname": "Hans", "Geburtsname": "", "Geburtsdatum": "", "Wohnort": "Mannheim", "PLZ": "68156" },
      [{
        idType: "biobankId", idString: "1234",
        tentative: true
      }]),
    tentativeMatch: new Patient({ "Nachname": "Müller", "Vorname": "Hans", "Geburtsname": "", "Geburtsdatum": "", "Wohnort": "Mannheim", "PLZ": "68156" },
      [{
        idType: "biobankId", idString: "3334",
        tentative: true
      }])
  },
  {
    patient: new Patient({ "Nachname": "Schmidt", "Vorname": "Anna", "Geburtsname": "Meier", "Geburtsdatum": "12.11.1990", "Wohnort": "Berlin", "PLZ": "10115" },
      [{
        idType: "biobankId", idString: "5678",
        tentative: true
      }]),
    tentativeMatch: new Patient({ "Nachname": "Schmidt", "Vorname": "Anna", "Geburtsname": "Meier", "Geburtsdatum": "12.11.1990", "Wohnort": "Berlin", "PLZ": "10115" },
      [{
        idType: "biobankId", idString: "5693",
        tentative: true
      }])
  },
  {
    patient: new Patient({ "Nachname": "Fischer", "Vorname": "Peter", "Geburtsname": "", "Geburtsdatum": "23.05.1985", "Wohnort": "Hamburg", "PLZ": "20095" },
      [{
        idType: "biobankId", idString: "9101",
        tentative: true
      }]),
    tentativeMatch: new Patient({ "Nachname": "Fischer", "Vorname": "Peter", "Geburtsname": "", "Geburtsdatum": "23.05.1985", "Wohnort": "Hamburg", "PLZ": "20095" },
      [{
        idType: "biobankId", idString: "9141",
        tentative: true
      }])
  },
  {
    patient: new Patient({ "Nachname": "Weber", "Vorname": "Julia", "Geburtsname": "Schneider", "Geburtsdatum": "15.08.1992", "Wohnort": "Munich", "PLZ": "80331" },
      [{
        idType: "biobankId", idString: "1121",
        tentative: true
      }]),
    tentativeMatch: new Patient({ "Nachname": "Weber", "Vorname": "Julia", "": "Schneider", "Geburtsdatum": "15.08.1992", "Wohnort": "Stuttgart", "PLZ": "80331" },
      [{
        idType: "biobankId", idString: "5542",
        tentative: true
      }])
  },
  {
    patient: new Patient({ "Nachname": "Bauer", "Vorname": "Michael", "Geburtsname": "", "Geburtsdatum": "30.01.1980", "Wohnort": "Frankfurt", "PLZ": "60311" },
      [{
        idType: "biobankId", idString: "3141",
        tentative: true
      }]),
    tentativeMatch: new Patient({ "Nachname": "Bauer", "Vorname": "Michael", "Geburtsname": "Schmidt", "Geburtsdatum": "30.01.1980", "Wohnort": "Frankfurt", "PLZ": "60311" },
      [{
        idType: "biobankId", idString: "3781",
        tentative: true
      }])
  }
];

@Component({
  selector: 'app-tentative-matches-list',
  templateUrl: './tentative-matches-list.component.html',
  styleUrls: ['./tentative-matches-list.component.css'],
})
export class TentativeMatchesListComponent implements OnInit {
  displayedColumns: string[] = [];
  public readonly Permission = Permission;
  dataSource = DATASOURCE;
  @Input() patients: MatTableDataSource<Patient>;
  @Input() loading: boolean = false;

  fields: Field[];
  fieldNames: string[];
  columns0: string[] = [];
  columns1: string[] = [];
  columns2: string[] = [];
  showAllIds: boolean;

  configuredIdTypes: string[] = [];
  private patientListService: PatientListService;

  constructor(
    public translate: TranslateService,
    patientListService: PatientListService,
    configService: AppConfigService,
    private titleService: GlobalTitleService,
  ) {
    this.patientListService = patientListService;
    this.patients = new MatTableDataSource<Patient>([]);
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
    console.log(this.fields);
    this.fields = this.fields.filter(f => f.name !== "Geburtsname" && f.name !== "Wohnort" && f.name !== "PLZ");
    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.fieldNames = this.fieldNames.filter(f => f !== "Geburtsname" && f !== "Wohnort" && f !== "PLZ");
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;
    this.changeTitle();
    console.log(this.dataSource);
  }

  changeTitle() {
    this.titleService.setTitle('Tentative Matches');
  }
  ngOnInit(): void {
    this.configuredIdTypes = this.patientListService.getIdTypes("R");
    let displayIdTypes = this.showAllIds ? this.configuredIdTypes : [this.patientListService.findDefaultIdType(this.configuredIdTypes)];
    this.columns0 = this.columns0.concat(["matches"]);
    this.columns1 = this.columns1.concat(displayIdTypes).concat(this.fieldNames).concat(["actions"]);
    this.columns2 = this.columns2.concat(displayIdTypes).concat(this.fieldNames).concat(["actions",]);

    console.log(this.dataSource);
  }
}
