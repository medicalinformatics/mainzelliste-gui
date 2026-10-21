import {TokenData} from "./token-data";

export class DeletePatientTokenData extends TokenData{
  constructor(
    public patientId: {idType: string, idString: string},
    public callback?: URL,
    public redirect?: URL
) {
  super(callback, redirect)
  }
}
