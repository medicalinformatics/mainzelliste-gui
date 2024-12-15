import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'bulk-id-generation-table',
    templateUrl: 'bulk-id-generation-table.component.html',
    styleUrls: ['./bulk-id-generation-table.component.css']
})
export class BulkIdGenerationTableComponent implements OnInit{

    @Input() csvRecords!: string[][];

    displayedColumns: string[] = ["index", "firstId", "secondId"];
    idTypes: string [] = ["#", "", ""];
    displayRecords: string[][] = [];

    ngOnInit(): void {
        this.setupTableData();
    }

    private setupTableData() {
        this.copyToDisplay();
        this.idTypes[1] = this.displayRecords[0][1];
        for(let i = 1; i < this.displayRecords.length; i++) {
            this.displayRecords[i - 1][1] = this.displayRecords[i][1];
        }
        if(this.displayRecords[0].length == 3) {
            this.idTypes[2] = this.displayRecords[0][2];
            for(let i = 1; i < this.displayRecords.length; i++) {
                this.displayRecords[i - 1][2] = this.displayRecords[i][2];
            }
        }
        if(this.displayRecords.length > 1) {
            this.displayRecords.pop()
        }
    }

    private copyToDisplay() {
        let i: number = 1;
        this.csvRecords.forEach(csvRow => {
            let data: string[] = [];
            data.push(i.toString());
            csvRow.forEach(csvData => {
                data.push(csvData);
            });
            this.displayRecords.push(data);
            i++;
        });
    }
}
