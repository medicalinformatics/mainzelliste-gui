import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: 'bulk-id-generation-table',
    templateUrl: 'bulk-id-generation-table.component.html',
    styleUrls: ['./bulk-id-generation-table.component.css']
})
export class BulkIdGenerationTableComponent implements OnInit{

    @ViewChild('paginator') paginator!: MatPaginator;
    @Input() csvRecords!: string[][];

    displayedColumns: string[] = ["index", "firstId", "secondId"];
    columnId: string [] = ["#", "", ""];
    element_data: string[][] = [];
    public defaultPageSize: number = 10;

    ngOnInit(): void {
        this.setupTableData();
    }

    getPageStart(paginator: MatPaginator) {
        return (paginator != undefined ? paginator.pageIndex * paginator.pageSize : 0);
    }
    
    getPageEnd(paginator: MatPaginator) {
        return this.getPageStart(paginator) + (paginator != undefined ? paginator.pageSize : this.defaultPageSize);
    }

    private setupTableData() {
        this.columnId[1] = this.csvRecords[0][0];
        if (this.csvRecords[0].length == 2) {
            this.columnId[2] = this.csvRecords[0][1];
        }
        let i: number = 0;
        this.csvRecords.forEach(csvRow => {
            if (i != 0) {
                this.element_data[i - 1] = [i.toString(), csvRow[0], csvRow[1]];
            }
            i++;
        });
    }
}
