export enum MainzellisteFieldType {
  IntegerField,
  PlainTextField,
  HashedField,
  ControlNumberField
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
