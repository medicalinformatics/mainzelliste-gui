import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfigService } from 'src/app/app-config.service';
import { ConsentService } from 'src/app/consent/consent.service';
import { ConsentPolicySet } from 'src/app/model/consent-policy-set';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { MatDialog } from '@angular/material/dialog';
import { PolicyDialogComponent } from '../policy-dialog/policy-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'externalId', 'name', 'expand'];
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
  }

  loadData(pageIndex: number, pageSize: number, fetch: boolean) {
    this.loading = true;
    let startFrom = pageSize * pageIndex;
    let endTo = startFrom + pageSize;

    this.setTableData(startFrom, endTo);
    this.loading = false;
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
}
