import {TokenData} from './token-data';
export class AddPatientTokenData extends TokenData{
  constructor(
    public idTypes: Array<string> = [],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect)
  }
}
