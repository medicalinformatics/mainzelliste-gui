export class Id {
  constructor(
    public idType: string,
    public idString: string,
    public tentative: boolean = false,
    public uri?: URL
  ) {
  }
}
