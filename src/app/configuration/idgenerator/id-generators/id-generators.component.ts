import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {IdGenerator} from "../../../model/idgenerator";
import {AppConfigService} from "../../../app-config.service";
import {Permission} from "../../../model/permission";
import {IdGeneratorDialogComponent} from "../id-generator-dialog/id-generator-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationService} from "../../../services/authorization.service";
import {IDGeneratorType} from "../../../model/id-generator-config";

@Component({
  selector: 'app-id-generators',
  templateUrl: './id-generators.component.html',
  styleUrls: ['./id-generators.component.css']
})
export class IdGeneratorsComponent implements OnInit {
  protected readonly Permission = Permission;
  protected readonly IDGeneratorType = IDGeneratorType;
  protected readonly Object = Object;

  idGeneratorNode: string = 'default'
  idGeneratorNodes: string[] = []
  idGeneratorTypesFilter: string[] = []
  loading: boolean = false;
  displayedColumns: string[] = ['idType', 'idgenerator'];
  matTableData: MatTableDataSource<IdGenerator>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  defaultPageSize: number = 8 as const;
  totalCount: number = 100000;
  idGeneratorFilter: string [] = [];

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
    this.idGeneratorNodes = [ ...this.appConfig.getMainzellisteAssociatedIdGeneratorsMap().keys()];
    this.idGeneratorNodes.push('default');
  }

  loadData(pageIndex: number, pageSize: number, fetch: boolean) {
    this.loading = true
    let starFrom = pageSize * pageIndex;
    let endTo = starFrom + pageSize;
    if(fetch) {
      if(this.idGeneratorNode === 'default') {
        this.appConfig.fetchMainzellisteIdGenerators().then(
          e => this.appConfig.fetchClaims()
        ).then(
          e => {
            this.authorizationService.initUserAllowedIDTypes();
            this.setTableData(starFrom, endTo);
          }
        )
      } else {
        this.appConfig.fetchMainzellisteAssociatedIdGenerators().then(
          e => this.appConfig.fetchClaims()
        ).then(
          e => {
            this.authorizationService.initUserAllowedIDTypes();
            this.setTableData(starFrom, endTo);
          }
        )
      }
    } else {
      this.setTableData(starFrom, endTo);
    }
    this.loading = false
  }

  setTableData(starFrom:number, endTo:number){
    let idGenerators : IdGenerator[] = (this.idGeneratorNode === 'default' ?
      this.appConfig.getMainzellisteIdGenerators() :
      this.appConfig.getMainzellisteAssociatedIdGeneratorsMap().get(this.idGeneratorNode) ?? [])
    .filter(g => this.idGeneratorTypesFilter.length == 0 || this.idGeneratorTypesFilter.some(t => t == g.idgenerator));
    this.matTableData.data = [...idGenerators.values()].slice(starFrom, endTo);
    this.totalCount = idGenerators.length;
  }

  handlePageEvent(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize, false);
  }

  openIDGeneratorDialog() {
    const dialogRef = this.idGeneratorDialog.open(IdGeneratorDialogComponent, {
      data: {
        idGenerator: IDGeneratorType.SimpleIDGenerator,
        idType: "",
        nodeName: this.idGeneratorNode,
        parameters: {}
      },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(idGenerator => {
      if (idGenerator) {
        this.loadData(0, this.defaultPageSize, true);
      }
    });
  }

  selectIdGeneratorNode(nodeName:string) {
    this.loadData(0, this.defaultPageSize, true);
  }

  selectIdGeneratorFilter(idGeneratorTypes:string[]) {
    this.idGeneratorTypesFilter = idGeneratorTypes;
    this.loadData(0, this.defaultPageSize, true);
  }
}
