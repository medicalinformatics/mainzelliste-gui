import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PatientListService } from "src/app/services/patient-list.service";
import { Patient } from "src/app/model/patient";
import { catchError } from "rxjs/operators";
import { AuthorizationService } from "src/app/services/authorization.service";
import { AppConfigService } from "src/app/app-config.service";
import { Field } from 'src/app/model/field';
import { PageEvent } from '@angular/material/paginator';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-secondary-identities',
  templateUrl: './secondary-identities.component.html',
  styleUrls: ['./secondary-identities.component.css']
})

export class SecondaryIdentitiesComponent implements OnInit {
  columns: string[] = [];
  allColumnNames: string[] = [];
  showAllIds: boolean;
  fieldNames: string[];
  displayedColumns: string[] = [];
  clickedRow: any;

  // required for displayed columns for secondary identities
  fields: Field[];

  //Pageinator
  public pageIndex = 0;
  public pageSize = 5;

  public secondaryIdentities: Patient[] = [];

  @Input() idType:  string = "";
  @Input() idString:  string = "";
  public patient: Patient = new Patient();
  public displayedConsentColumns: string[] = ['date', 'title', 'period', 'version', 'status', 'actions'];

  @Input() showNoIdentities: boolean = false;
  constructor(
    private patientListService: PatientListService,
    private authorizationService: AuthorizationService,
    private configService: AppConfigService,
    private patientService: PatientService,
  ) {
    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
    console.log(this.idString);
    console.log(this.idType)
  }

  ngOnInit() {
    this.displayedColumns = [...this.fields.map(field => field.name)];
    this.getSecondaryIdentities().pipe(
      catchError(e => {
        this.secondaryIdentities = [];
        throw e;
      })
    ).subscribe({
      next: (response) => {
        this.secondaryIdentities = response.data;
        this.secondaryIdentities = this.secondaryIdentities.map(patient =>
          this.patientListService.convertToDisplayPatient(patient, false, false, this.authorizationService.getTenants())
        );
      },

    })
  }

  getSecondaryIdentities() {
    return this.patientService.getSecondaryIdentities(this.idType, this.idString);
  }

  showIdentitiesCard() {
    return this.secondaryIdentities.length > 0;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onRowClick(row: any) {
    this.clickedRow = row;
  }

  isDifferent(element: any, field: string): boolean {
    if (!this.clickedRow) return false;
    return element.fields[field] !== this.clickedRow.fields[field];
  }

  isClickedRow(row: any): boolean {
    return this.clickedRow === row;
  }
}
