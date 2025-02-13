import {GlobalTitleService} from "../../services/global-title.service";
import {TranslateService} from '@ngx-translate/core';
import {MatTableDataSource} from '@angular/material/table';
import {Patient} from 'src/app/model/patient';
import {PatientListService} from 'src/app/services/patient-list.service';
import {AppConfigService} from 'src/app/app-config.service';
import {Field, SemanticType} from 'src/app/model/field';
import {Component, Input, OnInit,} from '@angular/core';
import {Permission} from "../../model/permission";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-tentative-matches-list',
  templateUrl: './tentative-matches-list.component.html',
  styleUrls: ['./tentative-matches-list.component.css'],
})
export class TentativeMatchesListComponent implements OnInit {

  matTableData: MatTableDataSource<{ [key: string]: string }> =
    new MatTableDataSource<{ [key: string]: string }>([]);
  columns: { name: string, type: 'resolveButton' | 'text' | 'separator', i18n: string }[] = []
  displayFieldTypes: SemanticType[] = [SemanticType.FIRSTNAME, SemanticType.LASTNAME, SemanticType.BIRTH_NAME, SemanticType.BIRTH_DAY, SemanticType.CITY]

  totalNumber: number = 100000;
  defaultPageSize: number = 10 as const;

  loading: boolean = false;

  constructor(
    public translate: TranslateService,
    public patientListService: PatientListService,
    public configService: AppConfigService,
    private titleService: GlobalTitleService,
  ) {
    this.patientListService = patientListService;
    this.changeTitle();
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant("read_tentatives.title"));
  }

  ngOnInit(): void {
    // init columns
    const fields = this.configService.data[0].fields.filter(f => !f.hideFromList && this.displayFieldTypes.includes(f.semantic));
    // this.columns.push({name: "timestamp", type: "text", i18n:""})
    fields.forEach(f => this.columns.push(
      {name: "p." + f.name, type: "text", i18n: f.i18n}
    ))
    this.columns.push({name: "id", type: "resolveButton", i18n: ""})
    // this.columns.push({name: "separator", type: "separator", i18n:""})
    fields.forEach(f => this.columns.push(
      {name: "b." + f.name, type: "text", i18n: f.i18n}
    ))

    // fetch data
    this.loadData(0, this.defaultPageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this.loading = true;
    this.patientListService.getTentatives(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.matTableData.data = response.data;
        this.totalNumber = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.matTableData.data = [];
        this.totalNumber = 0;
        this.loading = false
        throw error;
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  getColumnsNames() {
    return this.columns.map(c => c.name);
  }
}
