import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patientlist-view',
  templateUrl: './patientlist-view.component.html',
  styleUrls: ['./patientlist-view.component.css']
})
export class PatientlistViewComponent implements OnInit {
    title="Patientenliste";
  constructor() { }

  ngOnInit(): void {
  }

}
