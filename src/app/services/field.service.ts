import {Injectable} from '@angular/core';
import {Field} from "../model/field";
import {AppConfigService} from "../app-config.service";
import {GenderValue} from "../model/patientlist";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Array<Field> = [];
  private readonly genderFieldValues: GenderValue[]

  constructor(private configService: AppConfigService) {
    this.fields = this.configService.data[0].fields;
    this.genderFieldValues = this.configService.data[0].genderFieldValues;
  }

  getFields(): Array<Field> {
    return this.fields;
  }

  getSemanticFields(): {[key: string]: Field} {
    return Object.fromEntries( this.fields.map( f => [f.semantic.valueOf(), f]));
  }

  getGenderFieldValues(): GenderValue[] {
    return this.genderFieldValues;
  }
}
