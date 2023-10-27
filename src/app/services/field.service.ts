import { Injectable } from '@angular/core';
import {Field} from "../model/field";
import {AppConfigService} from "../app-config.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Array<Field> = [];

  constructor(private configService: AppConfigService) {
    this.fields = this.configService.data[0].fields;
  }

  getFields(): Array<Field> {
    // TODO: Create proper method to get all fields from a mainzelliste instance
    return this.fields;
  }
}
