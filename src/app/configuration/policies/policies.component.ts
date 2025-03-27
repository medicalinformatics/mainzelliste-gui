import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/internal/Observable';
import { ConsentService } from 'src/app/consent/consent.service';
import { ConsentPolicySet } from 'src/app/model/consent-policy-set';
import { MatDialog } from '@angular/material/dialog';
import { PolicyDialogComponent } from '../policy-dialog/policy-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PolicySetFormComponent } from '../policy-set-form/policy-set-form.component';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { take } from 'rxjs/operators';
import { CsvPolicyImportDialogComponent } from '../csv-policy-import-dialog/csv-policy-import-dialog.component';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'externalId', 'actions'];
  dataSource: MatTableDataSource<any>;
  expandedElement: any | null;
  loading: boolean = false;
  defaultPageSize: number = 8;
  totalCount: number = 100000;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private consentService: ConsentService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.loadData(0, this.defaultPageSize, false);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items per page';
  }  

  loadData(pageIndex: number, pageSize: number, fetch: boolean) {
    this.loading = true;
    let startFrom = pageSize * pageIndex;
    let endTo = startFrom + pageSize;

    this.setTableData(startFrom, endTo);
  }

  setTableData(startFrom: number, endTo: number) {
    let policySetsObservable: Observable<ConsentPolicySet[]> = this.consentService.getPolicySets();
    policySetsObservable.subscribe(policySets => {
      let data = policySets.map(policySet => ({
        id: policySet.id,
        externalId: policySet.externalId,
        name: policySet.name,
        policiesDataSource: new MatTableDataSource<any>([])
      }));
      this.dataSource = new MatTableDataSource(data.slice(startFrom, endTo));
      this.totalCount = policySets.length;
      this.loading = false;
      this.paginator.length = this.totalCount;
    });
  }

  handlePageEvent(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize, false);
  }

  openPolicyDialog(policySetId: string) {
    this.consentService.getPolicies(policySetId).subscribe(policies => {
      this.dialog.open(PolicyDialogComponent, {
        data: { policies: policies },
        maxWidth: '66vw',
        width: '66vw'
      });
    });
  }

  addPolicySet() {
    const dialogRef = this.dialog.open(PolicySetFormComponent, {
      width: '30vw',
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.loadData(0, this.defaultPageSize, false);
        this.paginator.firstPage();
      }
    });
  }
  

  addPolicy(policySetId: string) {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      width: '30vw',
      data: { policySetId }
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.loadData(0, this.defaultPageSize, false);
      }
    });
  }

  openCsvImportDialog(policySetId: string) {
    this.dialog.open(CsvPolicyImportDialogComponent, {
      data: { policySetId },
      width: '30vw'
    });
  }

}
