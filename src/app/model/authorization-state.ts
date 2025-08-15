import {MiscellaneousPermission, Operation, TenantPermission} from "./tenant";

export class AuthorizationState{
  DEFAULT: boolean = false;

  CREATE_PATIENT: boolean = false;
  READ_PATIENT: boolean = false;
  EDIT_PATIENT: boolean = false;
  DELETE_PATIENT: boolean = false;

  GENERATE_IDS: boolean = false;
  READ_IDS: boolean = false;
  EDIT_IDS: boolean = false;

  GENERATE_EXT_IDS: boolean = false;
  READ_EXT_IDS: boolean = false;
  EDIT_EXT_IDS: boolean = false;

  READ_FIELDS: boolean = false;
  EDIT_FIELDS: boolean = false;

  CREATE_CONSENT: boolean = false;
  READ_CONSENT: boolean = false;
  EDIT_CONSENT: boolean = false;
  DELETE_CONSENT: boolean = false;

  CREATE_CONSENT_TEMPLATE: boolean = false;
  READ_CONSENT_TEMPLATE: boolean = false;
  EDIT_CONSENT_TEMPLATE: boolean = false;
  DELETE_CONSENT_TEMPLATE: boolean = false;

  READ_CONSENT_POLICY: boolean = false;
  CREATE_CONSENT_POLICY: boolean = false;
  DELETE_CONSENT_POLICY: boolean = false;

  READ_CONSENT_POLICY_SET: boolean = false;
  CREATE_CONSENT_POLICY_SET: boolean = false;
  DELETE_CONSENT_POLICY_SET: boolean = false;

  EDIT_CONFIGURATION: boolean = false;
  ADD_PATIENTS: boolean = false;
  READ_TENTATIVES: boolean = false;
  READ_TENTATIVE: boolean = false;
  READ_IDENTITIES: boolean = false;

  setPatient(operation: Operation[]){
    this.CREATE_PATIENT = operation.some(o => o == "C");
    this.READ_PATIENT = operation.some(o => o == "R");
    this.EDIT_PATIENT = operation.some(o => o == "U");
    this.DELETE_PATIENT = operation.some(o => o == "D");
  }

  setIds(operation: Operation[]){
    this.GENERATE_IDS = operation.some(o => o == "C");
    this.READ_IDS = operation.some(o => o == "R");
    this.EDIT_IDS = operation.some(o => o == "U");
  }

  setExternalIds(operation: Operation[]){
    this.GENERATE_EXT_IDS = operation.some(o => o == "C");
    this.READ_EXT_IDS = operation.some(o => o == "R");
    this.EDIT_EXT_IDS = operation.some(o => o == "U");
  }

  setFields(operation: Operation[]){
    this.READ_FIELDS = operation.some(o => o == "R");
    this.EDIT_FIELDS = operation.some(o => o == "U");
  }

  setConsent(operation: Operation[]){
    this.CREATE_CONSENT = operation.some(o => o == "C");
    this.READ_CONSENT = operation.some(o => o == "R");
    this.EDIT_CONSENT = operation.some(o => o == "U");
    this.DELETE_CONSENT = operation.some(o => o == "D");
  }

  setConsentTemplate(operation: Operation[]){
    this.CREATE_CONSENT_TEMPLATE = operation.some(o => o == "C");
    this.READ_CONSENT_TEMPLATE = operation.some(o => o == "R");
    this.EDIT_CONSENT_TEMPLATE = operation.some(o => o == "U");
    this.DELETE_CONSENT_TEMPLATE = operation.some(o => o == "D");
  }

  setPolicy(operation: Operation[]){
    this.CREATE_CONSENT_POLICY = operation.some(o => o == "C");
    this.READ_CONSENT_POLICY = operation.some(o => o == "R");
    this.DELETE_CONSENT_POLICY = operation.some(o => o == "D");
  }

  setPolicySet(operation: Operation[]){
    this.CREATE_CONSENT_POLICY_SET = operation.some(o => o == "C");
    this.READ_CONSENT_POLICY_SET = operation.some(o => o == "R");
    this.DELETE_CONSENT_POLICY_SET = operation.some(o => o == "D");
  }

  setMiscellaneous(permissions: (MiscellaneousPermission|undefined)[]) {
    this.ADD_PATIENTS = permissions.some( p => p == "tt_addPatients");
    this.EDIT_CONFIGURATION = permissions.some( p => p == "tt_editConfiguration");
    this.READ_TENTATIVE = permissions.some( p => p == "tt_readTentative");
    this.READ_TENTATIVES = permissions.some( p => p == "tt_readTentatives");
    this.READ_IDENTITIES = permissions.some( p => p == "tt_readIdentities");
  }
}
