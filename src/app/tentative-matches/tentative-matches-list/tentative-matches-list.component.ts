import {GlobalTitleService} from "../../services/global-title.service";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {PatientListService} from 'src/app/services/patient-list.service';
import {AppConfigService} from 'src/app/app-config.service';
import {SemanticType} from 'src/app/model/field';
import {Component, OnInit,} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-tentative-matches-list',
  templateUrl: './tentative-matches-list.component.html',
  styleUrls: ['./tentative-matches-list.component.css'],
  imports: [
    TranslatePipe,
    MatProgressBar,
    MatIcon,
    MatPaginator,
    MatTable,
    NgSwitch,
    RouterLink,
    MatTooltip,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatColumnDef,
    MatCellDef,
    NgSwitchCase,
    MatHeaderCellDef,
    NgForOf,
    NgClass,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    NgIf,
    MatRow,
    MatRowDef,
    MatIconAnchor,
    NgStyle
  ]
})

export class TentativeMatchesListComponent implements OnInit {

  matTableData: MatTableDataSource<{ [key: string]: string }> =
    new MatTableDataSource<{ [key: string]: string }>([]);
  columns: ColumnDefinition[] = []
  header1: string[] = []
  header2: string[] = []
  displayFieldTypes: SemanticType[] = [SemanticType.FIRSTNAME, SemanticType.LASTNAME, SemanticType.BIRTHDATE]

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
    this.addColumn({id: "id", name: "id", type: "text", i18n: "read_tentatives.id", rowSpan: 2, colSpan: 1}, this.header1)
    this.addColumn({id: "timestamp", name: "timestamp", type: "text", i18n: "read_tentatives.timestamp", rowSpan: 2, colSpan: 1}, this.header1)
    this.addColumn({id: "matchScore", name: "matchScore", type: "text", i18n: "read_tentatives.matchScore", rowSpan: 2, colSpan: 1}, this.header1)
    this.addColumn({id: "separator", name: "empty", type: "separator", i18n: "", rowSpan: 2, colSpan: 1}, this.header1)

    const fields = this.configService.data[0].fields.filter(f => !f.hideFromList && this.displayFieldTypes.includes(f.semantic));
    this.addColumn({id: "tentative", name: "tentative", type: "empty", i18n: "read_tentatives.tentativeMatch", rowSpan: 1, colSpan: fields.length + 1}, this.header1)
    fields.forEach(f =>this.addColumn(
      {id: "p." + f.semantic,  name: "p." + f.name, type: "text", i18n: f.i18n, rowSpan: 1, colSpan: 1}, this.header2)
    )
    this.addColumn({id: "p.id", name: "p.id", type: "idCardButton", i18n: "read_tentatives.openTentativeMatch", rowSpan: 1, colSpan: 1}, this.header2)

    this.addColumn({id: "resolve", name: "button", type: "resolveButton", i18n: "", rowSpan: 2, colSpan: 1}, this.header1)

    this.addColumn({id: "bestMatch", name: "bestMatch", type: "empty", i18n: "read_tentatives.bestMatch", rowSpan: 1, colSpan: fields.length + 1}, this.header1)
    fields.forEach(f => this.addColumn(
      {id: "b." + f.semantic, name: "b." + f.name, type: "text", i18n: f.i18n, rowSpan: 1, colSpan: 1}, this.header2)
    )
    this.addColumn({id: "b.id", name: "b.id", type: "idCardButton", i18n: "read_tentatives.openBestMatch", rowSpan: 1, colSpan: 1}, this.header2)

    // fetch data
    this.loadData(0, this.defaultPageSize);
  }

  addColumn(colDef: ColumnDefinition, columnToDisplay: string[]){
    this.columns.push(colDef);
    columnToDisplay.push(colDef.id);
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

  getAllColumnsIds() {
    return this.columns.map(d => d.id);
  }
}

export interface ColumnDefinition {
  id: string,
  name: string,
  type: 'resolveButton' | 'idCardButton' | 'text' | 'separator' | 'empty',
  i18n: string
  rowSpan: number
  colSpan: number
}
