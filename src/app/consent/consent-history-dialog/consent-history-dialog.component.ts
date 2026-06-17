import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {ConsentHistoryRow} from "../consent.model";
import {Permission} from "../../model/permission";
import {ConsentService} from "../consent.service";
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow } from "@angular/material/table";
import {ConsentDialogComponent} from "../consent-dialog/consent-dialog.component";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatChip } from '@angular/material/chips';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-consent-dialog',
    templateUrl: './consent-history-dialog.component.html',
    styleUrls: ['./consent-history-dialog.component.css'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatChip, HasPermissionDirective, MatIconButton, MatIcon, MatTooltip, NgIf, MatProgressBar, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow, MatDialogActions, MatButton, TranslatePipe]
})

export class ConsentHistoryDialogComponent implements OnInit {

  public inProgress: boolean = false
  public consentHistoryRows: ConsentHistoryRow[] = [];
  public displayedConsentColumns: string[] = ['version', 'date', 'status', 'actions'];
  @ViewChild('consentHistoryTable') consentHistoryTable!: MatTable<ConsentHistoryRow>;
  constructor(
    public dialogRef: MatDialogRef<ConsentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      consentId: string,
      consentVersion: number
    },
    public consentDialog: MatDialog,
    public consentService: ConsentService) {
  }

  ngOnInit(): void {
    this.inProgress = true;
    this.consentService.readConsentHistory(this.dataModel.consentId, this.dataModel.consentVersion)
    .subscribe({
      next: consentHistoryRows => {
        this.consentHistoryRows = consentHistoryRows;
        this.consentHistoryTable.renderRows();
        this.inProgress = false;
      },
      error: () => this.inProgress = false
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openViewConsentDialog(consentId: string, consentVersion:number) {
    this.consentService.readConsent(consentId, consentVersion+"").subscribe(
      c => this.consentDialog.open(ConsentDialogComponent, {
        width: '900px',
        disableClose: true,
        data: {
          consent: c,
          readonly: true
        }
      })
    );
  }

  protected readonly Permission = Permission;
}
