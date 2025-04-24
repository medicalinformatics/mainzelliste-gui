import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MatSelectChange} from "@angular/material/select";
import {ConsentPolicy} from "../../model/consent-policy";
import {ConsentPolicySet} from "../../model/consent-policy-set";
import {ConsentService} from "../consent.service";
import {PolicyView} from "../consent-template.model";
import {NgModel, ValidationErrors} from "@angular/forms";
import {Validity} from "../consent-validity-period";


@Component({
  selector: 'consent-template-policy-dialog',
  templateUrl: 'consent-template-policy-dialog.html',
  styleUrls: ['./consent-template-policy-dialog.css']
})

export class ConsentTemplatePolicyDialog implements OnInit {

  public policies: Map<string, ConsentPolicy[]> = new Map();
  public policySets: ConsentPolicySet[] = [];

  public selectedPolicySetId: string | undefined;
  public selectedPolicy: ConsentPolicy | undefined;

  public policiesLoading: boolean = false;

  public validityPeriod: Validity = {month: 0, day: 0, year: 0};
  public validityDays: number[] = Array(32).fill(0).map((x, i) => i++)
  public validityMonths: number[] = Array(13).fill(0).map((x, i) => i++)

  constructor(
    public dialogRef: MatDialogRef<ConsentTemplatePolicyDialog>,
    public consentService: ConsentService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dataModel: {
      addedPolicyViews: PolicyView[],
      cachedPoliciesMap: Map<string, {policySet: ConsentPolicySet, policies: ConsentPolicy[]}>,
    }
  ) {
  }

  ngOnInit(): void {
    // init policySet list
    this.dataModel.cachedPoliciesMap.forEach((cachedValue, policySetId) => {
      const addedPolicies = this.dataModel.addedPolicyViews.filter(v => v.policySet.id == policySetId)
      if(addedPolicies.length > 0) {
        if(cachedValue.policies.length == 0) {
          // fetch policies from backend
          this.consentService.getPolicies(policySetId).subscribe(
            policies => {
              cachedValue.policies = policies;
              const filteredPolicies = policies.filter( p => addedPolicies.every(ap => ap.code != p.code))
              this.policies.set(policySetId, filteredPolicies);
              if(filteredPolicies.length > 0)
                this.policySets.push(cachedValue.policySet);
            }
          )
        } else {
          const filteredPolicies = cachedValue.policies.filter( p => addedPolicies.every(ap => ap.code != p.code))
          this.policies.set(policySetId, filteredPolicies);
          if(filteredPolicies.length > 0)
            this.policySets.push(cachedValue.policySet);
        }
      } else {
        this.policySets.push(cachedValue.policySet);
      }
    });
  }

  public getPolicies(): ConsentPolicy[] {
    return (this.policies.get(this.selectedPolicySetId || "") || []);
  }

  public fetchPolicies(matSelectChange: MatSelectChange) {
    let policies: ConsentPolicy[] | undefined = this.policies.get(matSelectChange.value);
    if (policies == undefined || policies.length == 0) {
      this.policiesLoading = true;
      this.consentService.getPolicies(matSelectChange.value).subscribe(
        r => {
          this.policies.set(matSelectChange.value, r);
          let cachedValue = this.dataModel.cachedPoliciesMap.get(matSelectChange.value)
          if(cachedValue != undefined){
            cachedValue.policies = r
          }
          this.policiesLoading = false;
        }
      )
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({
      policyView: {
        policySet: this.policySets.find(s => s.id == this.selectedPolicySetId),
        displayText: this.selectedPolicy?.text,
        code: this.selectedPolicy?.code,
        validity: {
          year: this.validityPeriod?.year,
          month: this.validityPeriod?.month ?? 0,
          day: this.validityPeriod?.day ?? 0
        }
      },
      cachedPoliciesMap: this.dataModel.cachedPoliciesMap,
    });
  }

  displayError(field: NgModel) {
    return field.invalid && (field.dirty || field.touched) && field.errors?.['required'];
  }

  getFieldErrorMessage(fieldName: string, errors: ValidationErrors | null) {
    if (errors?.['required'])
      return `${this.translate.instant('patientFields.error_mandatory_text1')} ${this.translate.instant('consent_template.' + fieldName )} ${this.translate.instant('patientFields.error_mandatory_text2')}`;
    else
      return "error";
  }
}
