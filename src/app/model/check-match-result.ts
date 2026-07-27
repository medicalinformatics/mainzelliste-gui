import {Id} from './id';

// response entry of POST /patients/checkMatch: similarity score plus one key/value pair per requested idType
export interface CheckMatchResult {
  similarityScore: string;
  [idType: string]: string;
}

export interface CheckMatchMatch {
  id: Id;
  similarityScore: string;
}
