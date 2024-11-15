export enum FieldType {
  TEXT = "TEXT",
  DATE = "DATE",
  NUMBER = "NUMBER",
}
export enum SemanticType{
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  BIRTH_NAME = "birthName",
  POSTAL_CODE = "postalCode",
  CITY = "city",
  UNDEFINED = "undefined"
}
export class Field {
  constructor(
    public i18n: string,
    public name: string,
    public mainzellisteField: string,
    public mainzellisteFields: string[],
    public semantic: SemanticType,
    public type: FieldType,
    public required: boolean,
    public validator: string,
    public hint: string = "",
    public hideFromList: boolean = false,
  ) {
  }
}
