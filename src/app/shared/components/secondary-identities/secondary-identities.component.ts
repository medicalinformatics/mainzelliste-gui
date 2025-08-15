import { Component, Input, OnInit } from '@angular/core';
import { PatientListService } from "src/app/services/patient-list.service";
import { Patient } from "src/app/model/patient";
import { catchError } from "rxjs/operators";
import { AuthorizationService } from "src/app/services/authorization.service";
import { AppConfigService } from "src/app/app-config.service";
import { Field, FieldType } from 'src/app/model/field';
import { PageEvent } from '@angular/material/paginator';
import { PatientService } from 'src/app/services/patient.service';
import { IdCardDialogComponent } from './dialog/id-card-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    public idCardDialog: MatDialog,
    private patientService: PatientService,
  ) {
    this.fieldNames = configService.data[0].fields.filter(f => !f.hideFromList).map(f => f.name);
    this.showAllIds = configService.data[0].showAllIds != undefined && configService.data[0].showAllIds;
    this.fields = configService.data[0].fields.filter(f => !f.hideFromList);
  }

  ngOnInit() {    
    // Add action column to displayed columns
    this.displayedColumns = [...this.fields.map(field => field.name), 'actions'];
    
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

  isDate(field: FieldType): any {
    return field == FieldType.DATE; 
  }

  openIDCardDialog(patient: Patient) {
  
  const dialogRef = this.idCardDialog.open(IdCardDialogComponent, {
    width: '1100px',
    maxHeight: '95vw',
    data: { patient: patient }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog was closed', result);
  });
  }
}