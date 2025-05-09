import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ConsentService} from 'src/app/consent/consent.service';
import {MatDialog} from '@angular/material/dialog';
import {PolicyDialogComponent} from '../policy-dialog/policy-dialog.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {PolicySetFormComponent} from '../policy-set-form/policy-set-form.component';
import {PolicyFormComponent} from '../policy-form/policy-form.component';
import {switchMap, take} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {
  ConfirmDeleteDialogComponent
} from 'src/app/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {Permission} from 'src/app/model/permission';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  defaultPageSize: number = 10;
  totalCount: number = 100000;
  protected readonly Permission = Permission;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly consentService: ConsentService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.loadData(0, this.defaultPageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this.loading = true;
    let startFrom = pageSize * pageIndex;
    let endTo = startFrom + pageSize;

    // fetch data from backend
    this.consentService.getPolicySets().subscribe(policySets => {
      let data = policySets.map(policySet => ({
        id: policySet.id,
        name: policySet.name
      }));
      this.dataSource = new MatTableDataSource(data.slice(startFrom, endTo));
      this.totalCount = policySets.length;
      this.loading = false
    });
  }

  handlePageEvent(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  openPolicyDialog(policySetId: string) {
    this.consentService.getPolicies(policySetId).subscribe(policies => {
      this.dialog.open(PolicyDialogComponent, {
        disableClose: true,
        data: { policies: policies, policySetId: policySetId },
        maxWidth: '66vw',
        width: '66vw'
      });
    });
  }

  addPolicySet() {
    const dialogRef = this.dialog.open(PolicySetFormComponent, {
      disableClose: true,
      width: '25vw',
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.loadData(0, this.defaultPageSize);
        this.paginator.firstPage();
      }
    });
  }

  addPolicy(policySetId: string) {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      disableClose: true,
      width: '25vw',
      data: { policySetId }
    });

    dialogRef.afterClosed().subscribe();
  }

  deletePolicySet(policySet: any): void {
    const policies = policySet.policies || [];
    const deletePolicies$ = policies.length
      ? forkJoin(
          policies.map((policy: any) =>
            this.consentService.deletePolicy(policy.code, policySet.id)
          )
        )
      : of(null);
    const deletionObservable = deletePolicies$.pipe(
      switchMap(() => this.consentService.deletePolicySet(policySet.id))
    );
    this.dialog.open(ConfirmDeleteDialogComponent, {
      disableClose: true,
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent_policySet",
        callbackObservable: deletionObservable
      }
    })
    .afterClosed()
    .subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter((ps: any) => ps.id !== policySet.id);
      }
    });
  }
}
