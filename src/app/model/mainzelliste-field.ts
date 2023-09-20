export enum MainzellisteFieldType {
  IntegerField = "IntegerField",
  PlainTextField = "PlainTextField",
  HashedField = "HashedField",
  ControlNumberField = "ControlNumberField"
}
export class MainzellisteField {
  constructor(
    public name: string,
    public type: MainzellisteFieldType,
    public required: boolean,
    public validation: string
  ) {
  }
}
