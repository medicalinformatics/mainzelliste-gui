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

  EDIT_CONFIGURATION: boolean = false;
  ADD_PATIENTS: boolean = false;
  READ_TENTATIVES: boolean = false;

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

  setMiscellaneous(permissions: TenantPermission[]) {
    //set default values
    this.EDIT_CONFIGURATION = false;
    this.ADD_PATIENTS = false
    this.READ_TENTATIVES = false
    permissions.forEach( p => {
      switch (p.miscellaneous){
        case "tt_editConfiguration": this.EDIT_CONFIGURATION = true; break;
        case "tt_addPatients": this.ADD_PATIENTS = true; break;
        case "tt_readTentatives": this.READ_TENTATIVES = true; break;
      }
    });
  }
}
