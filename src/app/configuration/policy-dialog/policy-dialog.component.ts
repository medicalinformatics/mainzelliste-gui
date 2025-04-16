import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Permission } from "../../model/permission";
import { ConsentService } from 'src/app/consent/consent.service';
import { Observable } from 'rxjs';
import { ConfirmDeleteDialogComponent } from 'src/app/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-policy-dialog',
  templateUrl: './policy-dialog.component.html',
  styleUrls: ['./policy-dialog.component.css']
})
export class PolicyDialogComponent {
  displayedColumns: string[] = ['policyId', 'policyName', 'actions'];
  dataSource: MatTableDataSource<any>;
  protected readonly Permission = Permission;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private consentService: ConsentService,
              private confirmDeleteDialog: MatDialog
            ) {
    this.dataSource = new MatTableDataSource(data.policies);
  }

  deletePolicy(policy: any): void {
    this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent_policy",
        callbackObservable: this.consentService.deletePolicy(policy.code, this.data.policySetId),
      },
    })
    .afterClosed().subscribe(result => {
      if (result)
        this.dataSource.data = this.dataSource.data.filter((p: any) => p.code !== policy.code);
    });
  }
}

