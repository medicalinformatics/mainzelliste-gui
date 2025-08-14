import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/app-config.service';
import { Id } from 'src/app/model/id';
import { MainzellisteUnknownError } from 'src/app/model/mainzelliste-unknown-error';
import { Patient } from 'src/app/model/patient';
import { Tenant } from 'src/app/model/tenant';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { PatientListService } from 'src/app/services/patient-list.service';
import { TranslateService } from '@ngx-translate/core';
import { IdType } from 'src/app/model/id-type';
import { SemanticType } from 'src/app/model/field';
import { PatientService } from 'src/app/services/patient.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-id-card-dialog',
  templateUrl: './id-card-dialog.component.html',
})
export class IdCardDialogComponent {
  secondaryIdentities: any;
  public idType: string = "";
  public idString: string = "";
  public hasError: boolean = false;
  public errorMessage: string = "";
  public patient: Patient = new Patient();
  private otherTenantIdTypes: string[] = [];
  public idTypes: IdType[] = [];
  private readIdTypes: string[] = [];

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<IdCardDialogComponent>,
    private patientListService: PatientListService,
    public configService: AppConfigService,
    private patientService: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient } | null
  ) {
    if (data != null) {
      this.patient = data.patient || new Patient;
    }
  }
  ngOnInit() {
    let internalIdTypes = this.patientListService.getAllInternalIdTypes("R");
    let mainIdType = this.patientListService.findDefaultIdType(internalIdTypes);
    this.idString = this.patient.getIdString(mainIdType);
    this.idType = mainIdType;
  }


  getContactInfo() {
    const fieldMap = this.getFieldMap();
    return `${fieldMap[SemanticType.FIRSTNAME]} ${fieldMap[SemanticType.LASTNAME]}\n${fieldMap[SemanticType.POSTAL_CODE]} ${fieldMap[SemanticType.CITY]}`;
  }

  exportCSV() {
    const fieldMap = this.getFieldMap();
    var data = [
      {
        firstName: fieldMap[SemanticType.FIRSTNAME],
        lastName: fieldMap[SemanticType.LASTNAME],
        residence: fieldMap[SemanticType.CITY],
        plz: fieldMap[SemanticType.POSTAL_CODE]
      }
    ]

    new AngularCsv(data, 'ContactInfo', {
      headers: [this.translate.instant("first_name_text"),
      this.translate.instant("last_name_text"),
      this.translate.instant("zip_code_text"),
      this.translate.instant("residence_text")],
      quoteStrings: '',
      delimiter: ';'
    },);
  }

  getFieldMap() {
    const contact = this.patient.fields;
    const fieldMap: { [key: string]: string } = {
      [SemanticType.FIRSTNAME]: "",
      [SemanticType.LASTNAME]: "",
      [SemanticType.POSTAL_CODE]: "",
      [SemanticType.CITY]: ""
    };

    this.patientService.getConfiguredFields("R").forEach(fieldConfig => {
      if (fieldMap.hasOwnProperty(fieldConfig.semantic)) {
        fieldMap[fieldConfig.semantic] = contact[fieldConfig.name];
      }
    });
    return fieldMap;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}