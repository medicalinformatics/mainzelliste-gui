import { Component, Input } from "@angular/core";

@Component({
    selector: 'project-id-table',
    templateUrl: 'table.component.html',
    styleUrls: ['./table.component.css']
})
export class ProjectIdTableComponent {
    @Input() csvRecords: string[][] = [];
}
