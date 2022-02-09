import {TokenData} from './token-data';

export class ReadPatientsTokenData extends TokenData{
  constructor(
    public searchIds: Array<{idType: string, idString: string}> = [],
    public resultFields: Array<string> = ['vorname', 'nachname'],
    public resultIds: Array<string> = ['pid'],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect)
  }

  addSearchId(type: string, value: string){
    this.searchIds.push({idType: type, idString: value});
  }

  addResultField(field: string){
    this.resultFields.push(field);
  }

  addResultId(id: string){
    this.resultIds.push(id);
  }
}
