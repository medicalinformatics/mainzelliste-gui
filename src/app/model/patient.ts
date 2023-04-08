export class Patient {

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<{ idType: string, idString: string }> = [],
  ) {}

  getIdString(type:string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }
}
