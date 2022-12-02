import {TokenData} from './token-data';
export type TokenType = 'readPatients' | 'addPatient' | 'editPatient' | 'deletePatient'
  | 'addConsent' | 'searchConsents' | 'editConsent' | 'readConsent';
export class Token {
  constructor(
    public id?: string,
    public type?: TokenType,
    public uri?: URL,
    public data?: TokenData
  ) {}
}
