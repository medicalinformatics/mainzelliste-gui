import {FieldService} from "../services/field.service";

export class Patient {

  constructor(
    public fields: { [key: string]: any } = {},
    public ids: Array<{ idType: string, idString: string }> = []
  ) {
    let fieldService = new FieldService()
    fieldService.fields.forEach(value => {
      if (fields[value.name] === undefined) {
        fields[value.name]=""
      }
    })
  }

}
