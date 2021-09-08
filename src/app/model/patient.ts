export class Patient {
  constructor(
    public fields: {[key: string]: any} = {},
    public ids: Array<{idType: string, idString: string}> = []
  ) {}
}
