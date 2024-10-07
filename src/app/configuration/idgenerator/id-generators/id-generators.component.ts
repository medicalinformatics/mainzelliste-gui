import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {GlobalTitleService} from "../../../services/global-title.service";
import {IdGenerator} from "../../../model/idgenerator";
import {AppConfigService} from "../../../app-config.service";
import {Permission} from "../../../model/permission";
import {IdGeneratorDialogComponent} from "../id-generator-dialog/id-generator-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationService} from "../../../services/authorization.service";

@Component({
  selector: 'app-id-generators',
  templateUrl: './id-generators.component.html',
  styleUrls: ['./id-generators.component.css']
})
export class IdGeneratorsComponent implements OnInit {
  protected readonly Permission = Permission;

  loading: boolean = false;
  displayedColumns: string[] = ['idType', 'idgenerator'];
  matTableData: MatTableDataSource<IdGenerator>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  defaultPageSize: number = 8 as const;
  totalCount: number = 100000;

  constructor(
    private appConfig: AppConfigService,
    private authorizationService: AuthorizationService,
    public idGeneratorDialog: MatDialog
  ) {
    this.matTableData = new MatTableDataSource<IdGenerator>([]);
  }

  ngOnInit(): void {
    this.loadData(0, this.defaultPageSize, false)
    //TODO pagination pageIndex pageSize
  }

  loadData(pageIndex: number, pageSize: number, fetch: boolean) {
    this.loading = true
    let starFrom = pageSize * pageIndex;
    let endTo = starFrom + pageSize;
    if(fetch){
      this.appConfig.fetchMainzellisteIdGenerators().then(
        e => this.appConfig.fetchClaims()
      ).then(
        e => {
          this.authorizationService.initUserAllowedIDTypes();
          this.setTableData(starFrom, endTo);
        }
      )
    } else {
      this.setTableData(starFrom, endTo);
    }
    this.loading = false
  }

  setTableData(starFrom:number, endTo:number){
    this.matTableData.data = [...this.appConfig.getMainzellisteIdGenerators().values()]
    .slice(starFrom, endTo);
    this.totalCount = this.appConfig.getMainzellisteIdGenerators().length;
  }

  handlePageEvent(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize, false);
  }

  openIDGeneratorDialog() {
    const dialogRef = this.idGeneratorDialog.open(IdGeneratorDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(idGenerator => {
      if (idGenerator) {
        this.loadData(0, this.defaultPageSize, true);
      }
    });
  }
}
