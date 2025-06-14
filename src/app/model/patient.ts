import {Id} from "./id";

export class Patient {

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<Id> = [],
    public tenants?: string[]
  ) {
  }

  getIdString(type: string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }
}
