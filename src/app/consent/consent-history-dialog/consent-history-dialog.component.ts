import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConsentHistoryRow} from "../consent.model";
import {Permission} from "../../model/permission";
import {ConsentService} from "../consent.service";
import {MatTable} from "@angular/material/table";
import {ConsentDialogComponent} from "../consent-dialog/consent-dialog.component";

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-history-dialog.component.html',
  styleUrls: ['./consent-history-dialog.component.css']
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
