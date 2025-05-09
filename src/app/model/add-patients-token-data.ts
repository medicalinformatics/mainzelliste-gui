import {TokenData} from "./token-data";

export class AddPatientsTokenData extends TokenData{
  constructor(
    public idTypes: Array<string> = [],
  ) {
    super()
  }
}
