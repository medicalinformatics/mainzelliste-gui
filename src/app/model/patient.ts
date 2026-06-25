import {Id} from "./id";
import {DateTime} from "luxon";

export class Patient {

  constructor(
    public fields: { [key: string]: string | DateTime} = {},
    public ids: Array<Id> = [],
    public tenants?: string[]
  ) {
  }

  getIdString(type: string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }
}
