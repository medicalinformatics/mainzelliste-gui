import {TokenData} from './token-data';
export type TokenType = 'readPatients' | 'addPatient' | 'editPatient' | 'deletePatient' | 'createIds'
  | 'addConsent' | 'searchConsents' | 'editConsent' | 'readConsent' | 'deleteConsent' | 'addConsentTemplate' | 'searchConsentTemplates'
  | 'readConsentTemplate' | 'deleteConsentTemplate' | 'addConsentPolicySet' | 'readConsentPolicySet' | 'searchConsentPolicySets'
  | 'addConsentPolicy' | 'searchConsentPolicies' | 'addConsentScan' | 'addConsentProvenance'
  | 'searchConsentProvenances' | 'readConsentScan' | 'editConfiguration' | 'checkMatch' | 'addPatients';
export class Token {
  constructor(
    public id?: string,
    public type?: TokenType,
    public uri?: URL,
    public data?: TokenData
  ) {}
}
