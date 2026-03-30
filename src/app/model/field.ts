export enum FieldType {
  TEXT = "TEXT",
  SEX = "SEX",
  DATE = "DATE",
  NUMBER = "NUMBER",
  STREET = "STREET",
  POSTAL_CODE = "POSTAL_CODE",
  CITY = "CITY",
}
export enum SemanticType{
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  BIRTH_NAME = "birthName",
  SEX = "sex",
  STREET = "street",
  HOUSE_NUMBER = "houseNumber",
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
