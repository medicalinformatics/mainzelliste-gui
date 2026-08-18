import {Component} from '@angular/core';
import {MatDialogRef, MatDialogTitle, MatDialogActions} from "@angular/material/dialog";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Patient} from "../../../model/patient";
import {PatientListService} from "../../../services/patient-list.service";
import {AuthorizationService} from "../../../services/authorization.service";
import {PatientInputFieldsComponent} from "../../../patient/patient-input-fields.component";
import {DateTime} from "luxon";
import {Field, SemanticType} from "../../../model/field";
import {FieldService} from "../../../services/field.service";

@Component({
  selector: 'app-find-similar-patients-dialog',
  templateUrl: './find-similar-patients-dialog.component.html',
  styleUrls: ['./find-similar-patients-dialog.component.css'],
  imports: [MatDialogTitle, MatDialogActions, FormsModule, NgIf, PatientInputFieldsComponent,
    MatButton, MatIcon, MatProgressSpinner, TranslatePipe]
})
export class FindSimilarPatientsDialogComponent {
  patient: Patient = new Patient();
  semanticFields: { [key: string]: Field };

  inProgress: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FindSimilarPatientsDialogComponent>,
    private patientListService: PatientListService,
    private authorizationService: AuthorizationService,
    private fieldService: FieldService,
    private translate: TranslateService
  ) {
    this.semanticFields = this.fieldService.getSemanticFields();
  }

  hasAnyValue(): boolean {
    return Object.values(this.patient.fields).some(v =>
      v instanceof DateTime || (v ?? "").toString().trim().length > 0);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  buildDisplaySnapshot(patient: Patient){
    const fieldToString = (t: SemanticType, p:Patient) =>
      this.translate.instant(this.semanticFields[t].i18n) + ":"
      + (p.fields[this.semanticFields[t].name] instanceof DateTime ? (p.fields[this.semanticFields[t].name] as DateTime).setLocale(this.translate.getCurrentLang())
      .toLocaleString(DateTime.DATE_SHORT) : p.fields[this.semanticFields[t].name]);
    return [SemanticType.FIRSTNAME , SemanticType.LASTNAME, SemanticType.BIRTHDATE].map( t => fieldToString(t, patient)).join(", ");
  }

  findSimilarPatients(): void {
    this.inProgress = true;
    const patientSnapshot = this.buildDisplaySnapshot(this.patient);
    this.patientListService.patientMatches(this.patient, 0, 10).subscribe({
      next: match => {
        this.inProgress = false;
        if (match == undefined) {
          this.dialogRef.close({ filterDisplay: patientSnapshot });
          return;
        }
        this.dialogRef.close( {
          matchResults: match.patients.map(m => {
            let p = this.patientListService.convertToDisplayPatient(m.patient, true, this.authorizationService.getTenants());
            p.matchingScore = `${parseFloat((Number(m.score) * 100).toFixed(2))}%`;
            return p;
          }),
          filterDisplay: patientSnapshot,
          totalCount: match.totalCount
        });
      },
      error: e => {
        this.inProgress = false;
        throw e;
      }
    });
  }
}
