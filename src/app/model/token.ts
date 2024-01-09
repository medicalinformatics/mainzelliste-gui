import {TokenData} from './token-data';
export type TokenType = 'readPatients' | 'addPatient' | 'editPatient' | 'deletePatient' | 'createIds'
  | 'addConsent' | 'searchConsents' | 'editConsent' | 'readConsent' | 'addConsentTemplate' | 'searchConsentTemplates'
  | 'readConsentTemplate';
export class Token {
  constructor(
    public id?: string,
    public type?: TokenType,
    public uri?: URL,
    public data?: TokenData
  ) {}
}
