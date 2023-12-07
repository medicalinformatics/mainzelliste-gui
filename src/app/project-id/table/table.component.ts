import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'project-id-table',
    templateUrl: 'table.component.html',
    styleUrls: ['./table.component.css']
})
export class ProjectIdTableComponent implements OnInit{

    @Input() csvRecords!: string[][];

    ids: string[] = ["firstId", "secondId"];
    idTypes: string [] = ["", ""];
    displayRecords: string[][] = [];

    ngOnInit(): void {
        this.setupTableData();
    }

    private setupTableData() {
        this.copyToDisplay();
        this.idTypes[0] = this.displayRecords[0][0];
        for(let i = 1; i < this.displayRecords.length; i++) {
            this.displayRecords[i - 1][0] = this.displayRecords[i][0];
        }
        if(this.displayRecords[0].length == 2) {
            this.idTypes[1] = this.displayRecords[0][1];
            for(let i = 1; i < this.displayRecords.length; i++) {
                this.displayRecords[i - 1][1] = this.displayRecords[i][1];
            }
        }
        if(this.displayRecords.length > 1) {
            this.displayRecords.pop()
        }
    }

    private copyToDisplay() {
        this.csvRecords.forEach(csvRow => {
            let data: string[] = [];
            csvRow.forEach(csvData => {
                data.push(csvData);
            });
            this.displayRecords.push(data); 
        });
    }
}
