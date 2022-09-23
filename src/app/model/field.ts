export enum FieldType {
  TEXT,
  DATE
}
export class Field {
  constructor(
    public name: string,
    public mainzellisteField: string,
    public mainzellisteFields: string[],
    public type: FieldType,
    public required: boolean,
    public validator: string,
    public hint: string = ""
  ) {
  }
}
