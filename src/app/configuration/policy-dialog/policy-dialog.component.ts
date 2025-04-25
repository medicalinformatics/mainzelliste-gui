import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-policy-dialog',
  templateUrl: './policy-dialog.component.html',
  styleUrls: ['./policy-dialog.component.css']
})
export class PolicyDialogComponent {
  displayedColumns: string[] = ['policyId', 'policyName'];
  dataSource: MatTableDataSource<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = new MatTableDataSource(data.policies);
  }
}
