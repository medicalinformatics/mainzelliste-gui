import {MiscellaneousPermission, Operation, PermissionType} from "./tenant";

export class Permission {
  public static readonly DEFAULT = new Permission("default", "R");

  public static readonly CREATE_PATIENT = new Permission("patient", "C");
  public static readonly READ_PATIENT = new Permission("patient", "R");
  public static readonly EDIT_PATIENT = new Permission("patient", "U");
  public static readonly DELETE_PATIENT = new Permission("patient", "D");

  public static readonly GENERATE_IDS = new Permission("ids", "C");
  public static readonly READ_IDS = new Permission("ids", "R");
  public static readonly EDIT_IDS = new Permission("ids", "U");

  public static readonly GENERATE_EXT_IDS = new Permission("externalIds", "C");
  public static readonly READ_EXT_IDS = new Permission("externalIds", "R");
  public static readonly EDIT_EXT_IDS = new Permission("externalIds", "U");

  public static readonly READ_FIELDS = new Permission("fields", "R");
  public static readonly EDIT_FIELDS = new Permission("fields", "U");

  public static readonly CREATE_CONSENT = new Permission("consent", "C");
  public static readonly READ_CONSENT = new Permission("consent", "R");
  public static readonly EDIT_CONSENT = new Permission("consent", "U");
  public static readonly DELETE_CONSENT = new Permission("consent", "D");

  public static readonly CREATE_CONSENT_PROVISION = new Permission("provision", "C");
  public static readonly READ_CONSENT_PROVISION = new Permission("provision", "R");

  public static readonly ADD_CONSENT_SCANS = new Permission("scans", "C");
  public static readonly READ_CONSENT_SCANS = new Permission("scans", "R");

  public static readonly CREATE_CONSENT_TEMPLATE = new Permission("consentTemplate", "C");
  public static readonly READ_CONSENT_TEMPLATE = new Permission("consentTemplate", "R");
  public static readonly EDIT_CONSENT_TEMPLATE = new Permission("consentTemplate", "U");
  public static readonly DELETE_CONSENT_TEMPLATE = new Permission("consentTemplate", "D");

  public static readonly CREAT_CONSENT_POLICY = new Permission("policy", "C");
  public static readonly READ_CONSENT_POLICY = new Permission("policy", "R");
  public static readonly DELETE_CONSENT_POLICY = new Permission("policy", "D");
  public static readonly CREATE_CONSENT_POLICY_SET = new Permission("policySet", "C");
  public static readonly READ_CONSENT_POLICY_SET = new Permission("policySet", "R");
  public static readonly DELETE_CONSENT_POLICY_SET = new Permission("policySet", "D");

  public static readonly EDIT_CONFIGURATION = new Permission("miscellaneous", "U", "tt_editConfiguration");
  public static readonly ADD_PATIENTS = new Permission("miscellaneous", "C", "tt_addPatients");
  public static readonly READ_TENTATIVES = new Permission("miscellaneous", "R", "tt_readTentatives");
  public static readonly READ_TENTATIVE = new Permission("miscellaneous", "R", "tt_readTentative");
  public static readonly READ_IDENTITIES = new Permission("miscellaneous", "R", "tt_readIdentities");

  constructor(
    public type: PermissionType,
    public operation: Operation,
    public miscellaneous?: MiscellaneousPermission
  ) {
  }
}
