import {Component, Input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Patient} from "../model/patient";
import {Field, FieldType, SemanticType} from "../model/field";
import {FieldService} from "../services/field.service";
import {TextFieldComponent} from "./fields/text-field/text-field.component";
import {DateFieldComponent} from "./fields/date-field/date-field.component";
import {SexFieldComponent} from "./fields/sex-field/sex-field.component";

@Component({
  selector: 'app-patient-input-fields',
  templateUrl: './patient-input-fields.component.html',
  imports: [TranslatePipe, TextFieldComponent, DateFieldComponent, SexFieldComponent]
})
export class PatientInputFieldsComponent {
  protected readonly SemanticType = SemanticType;
  protected readonly FieldType = FieldType;

  @Input({required: true}) patient!: Patient;
  @Input() requiredForRL: boolean = false;

  semanticFields: { [key: string]: Field };
  // ensure backward compatibility
  requireForRLConfigExist: boolean;

  constructor(private readonly fieldService: FieldService) {
    this.semanticFields = fieldService.getSemanticFields();
    this.requireForRLConfigExist = fieldService.getFields().some(f => f.requiredForRL);
  }

  get nonSemanticFields(): Field[] {
    return this.fieldService.getFields()
      .filter(f => (!f.semantic || f.semantic == SemanticType.UNDEFINED) && (!this.requiredForRL || !this.requireForRLConfigExist || f.requiredForRL));
  }

  hasField(semantic: SemanticType): boolean {
    const field = this.semanticFields[semantic.valueOf()];
    return field != undefined && (!this.requiredForRL || !this.requireForRLConfigExist || field.requiredForRL);
  }

  hasAnyFields(semantics: SemanticType[]): boolean {
    return semantics.some(s => this.hasField(s));
  }

  getFieldName(semantic: SemanticType): string {
    return this.semanticFields[semantic.valueOf()].name;
  }
}
