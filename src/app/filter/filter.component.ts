import { Component, OnInit } from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  title="Filter";

  constructor(public dialogRef: MatDialogRef<FilterComponent>) { }
  ngOnInit(): void {
  }

  closeFilter(){
    console.log("closedFilter");
    this.dialogRef.close();
  }
}
