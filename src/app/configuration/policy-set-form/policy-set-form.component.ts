import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-policy-set-form',
  templateUrl: './policy-set-form.component.html',
  styleUrls: ['./policy-set-form.component.css']
})
export class PolicySetFormComponent implements OnInit {
  policySetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicySetFormComponent>
  ) {
    this.policySetForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      externalId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.policySetForm.valid) {
      this.dialogRef.close(this.policySetForm.value);
    }
  }
}
