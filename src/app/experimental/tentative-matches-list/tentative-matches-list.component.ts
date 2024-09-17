import { GlobalTitleService } from "../../services/global-title.service";
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/model/patient';
import { PatientListService } from 'src/app/services/patient-list.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Field } from 'src/app/model/field';
import { Component, Input, OnInit,  } from '@angular/core';
import { Permission } from "../../model/permission";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-tentative-matches-list',
  templateUrl: './tentative-matches-list.component.html',
  styleUrls: ['./tentative-matches-list.component.css'],
})
export class TentativeMatchesListComponent implements OnInit {
  displayedColumns: string[] = [];
  public readonly Permission = Permission;
  @Input() patients: MatTableDataSource<Patient>;
  @Input() loading: boolean = false;

  fields: Field[];
  fieldNames: string[];
  columns: string[] = [];
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
    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle('Tentative Matches');
  }
  ngOnInit(): void {
    this.configuredIdTypes = this.patientListService.getIdTypes("R");
    let displayIdTypes = this.showAllIds ? this.configuredIdTypes : [this.patientListService.findDefaultIdType(this.configuredIdTypes)];
    this.columns = this.columns.concat(displayIdTypes).concat(this.fieldNames).concat(["actions"]);
  }

}
