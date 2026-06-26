import {Component, Input, model} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {Field} from "../../../model/field";
import {AppConfigService} from "../../../app-config.service";
import {GenderValue} from "../../../model/patientlist";
import {ControlContainer, FormsModule, NgForm} from "@angular/forms";
import {DateTime} from "luxon";

@Component({
  selector: 'app-sex-field',
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    TranslatePipe,
    MatFormField,
    MatFormField,
    FormsModule
  ],
  templateUrl: './sex-field.component.html',
  styleUrl: './sex-field.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class SexFieldComponent {
  data = model<string | DateTime>();
  @Input() field!: Field

  public readonly genderFieldValues: GenderValue[];

  constructor(private configService: AppConfigService) {
    this.genderFieldValues = this.configService.data[0].genderFieldValues;
  }
}
