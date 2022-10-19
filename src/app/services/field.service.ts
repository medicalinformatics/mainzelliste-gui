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

  getFields(): Promise<Array<Field>> {
    // TODO: Create proper method to get all fields from a mainzelliste instance
    return new Promise((resolve, reject) => {
      resolve(this.fields);
    });
  }
}
