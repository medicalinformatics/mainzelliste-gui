import {TokenData} from './token-data';

export class PatientMatchesTokenData extends TokenData{
  constructor(
    public resultFields: Array<string> = [],
    public resultIds: Array<string> = [],
  ) {
    super();
  }

  addResultField(field: string){
    this.resultFields.push(field);
  }

  addResultId(id: string){
    this.resultIds.push(id);
  }
}
