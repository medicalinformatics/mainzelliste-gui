import {TokenData} from './token-data';

export class CheckMatchTokenData extends TokenData {
  constructor(
    public idtypes: Array<string> = [],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect)
  }
}
