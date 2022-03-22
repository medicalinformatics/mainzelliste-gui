import {FieldService} from "../services/field.service";
import {AppConfigService} from "../app-config.service";

export class Patient {

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<{ idType: string, idString: string }> = []
  ) {
    let fieldService = new FieldService() /*new Patient*/
    fieldService.fields.forEach(value => {
      if (fields[value.name] === undefined) {
        fields[value.name]=""
      }
      // müssen hier die IDs definiert/befüllt werden?
    })

  }

}
