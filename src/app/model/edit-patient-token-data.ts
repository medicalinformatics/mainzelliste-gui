import {TokenData} from "./token-data";

export class EditPatientTokenData extends TokenData {
  constructor(
    public patientId: {idType: string, idString: string},
    public fields: string[],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect)
  }
}
