import {TokenData} from './token-data';

export class CreateIdsTokenData extends TokenData{
  constructor(
    public searchIds: [{idType:string, idString:string}],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect);
  }

}