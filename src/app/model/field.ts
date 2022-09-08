export class Field {
  constructor(
    public name: string,
    public mainzellisteField: string,
    public mainzellisteFields: string[],
    public required: boolean,
    public validator: string,
    public hint: string = ""
  ) {
  }
}
