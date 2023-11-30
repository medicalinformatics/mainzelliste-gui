import {PermissionType} from "./role";
import {Operation} from "./patientlist";

export class Permission {
  public static readonly CREATE_PATIENT = new Permission("patient", "C");
  public static readonly READ_PATIENT = new Permission("patient", "R");
  public static readonly EDIT_PATIENT = new Permission("patient", "U");
  public static readonly DELETE_PATIENT = new Permission("patient", "D");

  public static readonly GENERATE_IDS = new Permission("ids", "C");
  public static readonly READ_IDS = new Permission("ids", "R");
  public static readonly EDIT_IDS = new Permission("ids", "U");

  public static readonly READ_FIELDS = new Permission("fields", "R");
  public static readonly EDIT_FIELDS = new Permission("fields", "U");

  public static readonly CREATE_CONSENT = new Permission("consent", "C");
  public static readonly READ_CONSENT = new Permission("consent", "R");
  public static readonly EDIT_CONSENT = new Permission("consent", "U");
  constructor(
    public type: PermissionType,
    public operation: Operation
  ) {
  }
}
