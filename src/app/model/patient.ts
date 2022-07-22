export class Patient {

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<{ idType: string, idString: string }> = [],
  ) {}

}
