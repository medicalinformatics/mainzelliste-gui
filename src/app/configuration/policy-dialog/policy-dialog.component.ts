import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Permission } from "../../model/permission";
import { ConsentService } from 'src/app/consent/consent.service';
import { ConfirmDeleteDialogComponent } from 'src/app/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {getErrorMessageFrom} from "../../error/error-utils";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-dialog',
  templateUrl: './policy-dialog.component.html',
  styleUrls: ['./policy-dialog.component.css']
})
export class PolicyDialogComponent {
  displayedColumns: string[] = ['policyId', 'policyName', 'actions'];
  dataSource: MatTableDataSource<any>;
  protected readonly Permission = Permission;
  errorMessages: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private consentService: ConsentService,
              private confirmDeleteDialog: MatDialog,
              private translate: TranslateService,
            ) {
    this.dataSource = new MatTableDataSource(data.policies);
  }

  deletePolicy(policy: any): void {
    this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent_policy",
        callbackObservable: this.consentService.deletePolicy(policy.code, this.data.policySetId),
        returnError: true
      },
    })
    .afterClosed().subscribe(result => {
      if (result){
        if(result instanceof Error)
          this.errorMessages.push(getErrorMessageFrom(result, this.translate));
        else
          this.dataSource.data = this.dataSource.data.filter((p: any) => p.code !== policy.code);
      }
    });
  }
}

