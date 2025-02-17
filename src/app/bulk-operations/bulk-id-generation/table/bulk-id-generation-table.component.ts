import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

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
    element_data: Element[] = [];
    dataSource = new MatTableDataSource<Element>(this.element_data);

    ngOnInit(): void {
        this.setupTableData();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    private setupTableData() {
        this.columnId[1] = this.csvRecords[0][0];
        if (this.csvRecords[0].length == 2) {
            this.columnId[2] = this.csvRecords[0][1];
        }
        let i: number = 0;
        this.csvRecords.forEach(csvRow => {
            if (i != 0) {
                this.element_data.push({position: i, id_x: csvRow[0], id_y: csvRow[1]});
            }
            i++;
        });
    }
}

export interface Element {
    position: number;
    id_x: string;
    id_y: string;
}