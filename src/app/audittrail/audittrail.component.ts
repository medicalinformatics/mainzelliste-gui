import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-audittrail',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.css']
})
export class AudittrailComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  displayedColumns = ['date', 'action', 'info', 'symbol'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }
}

export interface Element {
  date: Date;
  action: string;
  info: string;
  symbol: string;

}
const ELEMENT_DATA: Element[] = [
  {date: new Date(2023, 9, 23, 10, 10), action: 'action1', info: 'info1', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 11, 20), action: 'action2', info: 'info2', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 12, 30), action: 'action3', info: 'info3', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 13, 40), action: 'action4', info: 'info4', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 14, 50), action: 'action5', info: 'info5', symbol: 'folder'},
  {date: new Date(2024, 9, 23, 15, 0), action: 'action6', info: 'info6', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 16, 10), action: 'action7', info: 'info7', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 17, 20), action: 'action8', info: 'info8', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 18, 30), action: 'action9', info: 'info9', symbol: 'folder'},
  {date: new Date(2024, 9, 23, 19, 40), action: 'action10', info: 'info10', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 20, 50), action: 'action11', info: 'info11', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 21, 0), action: 'action12', info: 'info12', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 22, 10), action: 'action13', info: 'info13', symbol: 'folder'},
  {date: new Date(2023, 9, 23, 23, 20), action: 'action14', info: 'info14', symbol: 'folder'},
  {date: new Date(2023, 9, 24, 0, 30), action: 'action15', info: 'info15', symbol: 'folder'},
  {date: new Date(2023, 9, 24, 10, 40), action: 'action16', info: 'info16', symbol: 'folder'},
  {date: new Date(2023, 9, 24, 11, 50), action: 'action17', info: 'info17', symbol: 'folder'},
  {date: new Date(2023, 9, 24, 12, 0), action: 'action18', info: 'info18', symbol: 'folder'},
  {date: new Date(2023, 9, 24, 13, 10), action: 'action19', info: 'info19', symbol: 'folder'},
];