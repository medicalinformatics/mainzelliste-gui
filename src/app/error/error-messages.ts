import {HttpErrorResponse} from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

export class ErrorMessage {
  constructor(
    public id: number,
    public message: string | RegExp,
    public i18n: string
  ) {
  }

  public match(errorResponse: HttpErrorResponse): boolean {
    let errorMessage = !errorResponse.error.message ? errorResponse.error : errorResponse.error.message;
    return this.message instanceof RegExp ? errorMessage.match(this.message) : this.message == errorMessage;
  }

  public findVariables(errorResponse: HttpErrorResponse): string[] {
    let errorMessage = !errorResponse.error.message ? errorResponse.error : errorResponse.error.message;
    let result: string[] = errorMessage.match(this.message);
    if(result.length > 1)
      result.shift();
    return this.message instanceof RegExp? result : [];
  }

  public getMessageDE(messageVariable?:string) : string {
    if(messageVariable != undefined && messageVariable.length > 0) {
      return ErrorMessages.translate.instant(this.i18n).replace("${1}", messageVariable);
    } else
      return ErrorMessages.translate.instant(this.i18n);
  }
}

export class ErrorMessages {

  static translate: TranslateService;

  constructor(
    translate: TranslateService
  ) {
    translate = translate;
  }
  ////
  // General ERRORS
  //-------------------
  public static ML_SESSION_NOT_FOUND: ErrorMessage = new ErrorMessage(101,
    /Session-ID (.*) unknown./i,
  "error.global_session_not_found");

  ////
  // ADD PATIENT ERRORS
  //-------------------
  public static CREATE_PATIENT_MISSING_FIELD: ErrorMessage = new ErrorMessage(1001,
    "Neither complete IDAT nor an external ID has been given as input!",
    "error.create_patient_missing_field");
  public static CREATE_PATIENT_MISSING_ID_TYPE: ErrorMessage = new ErrorMessage(1002,
    "Please select an id type",
    "error.create_patient_missing_id_type");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(1003,
    "Multiple patients found with the given external IDs!",
    "error.create_patient_conflict_ext_ids_multiple_match");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS: ErrorMessage = new ErrorMessage(1004,
    "Found existing patient with matching IDAT but conflicting external ID(s).",
    "error.create_patient_conflict_ext_ids");
  public static CREATE_PATIENT_CONFLICT_IDAT: ErrorMessage = new ErrorMessage(1005,
    "Found existing patient with matching external ID but conflicting IDAT!",
    "error.create_patient_conflict_idat");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(1006,
    "External ID and IDAT match with different patients, respectively!",
    "error.create_patient_conflict_ext_ids_idat_multiple_match");
  public static CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH: ErrorMessage = new ErrorMessage(1007,
    "Unable to definitely determined whether the data refers to an existing or to a new patient. Please check data or resubmit with sureness=true to get a tentative result. Please check documentation for details.",
    "error.create_patient_conflict_possible_match");
  public static CREATE_PATIENT_INVALID_FIELD: ErrorMessage = new ErrorMessage(1008,
    /Field (\w+) does not conform to the required format/i,
    "error.create_patient_invalid_field");
  public static CREATE_PATIENT_INVALID_EXT_ID: ErrorMessage = new ErrorMessage(1009,
    /ID (.*) is invalid for type (\w+)/i,
    "error.create_patient_invalid_ext_id");
  public static CREATE_PATIENT_INVALID_DATE_1: ErrorMessage = new ErrorMessage(1010,
    /(.*) is not a valid date!/i,
    "error.create_patient_invalid_date_1");
  public static CREATE_PATIENT_INVALID_DATE_2: ErrorMessage = new ErrorMessage(1011,
    /(.*) is in the future!/i,
    "error.create_patient_invalid_date_2")

    ////
    // EDIT PATIENT ERRORS
    //---------------------
  public static EDIT_PATIENT_EMPTY_FIELD: ErrorMessage = new ErrorMessage(2001,
    /Field (\w+) must not be empty!/i,
    "error.edit_patient_empty_field");
  public static EDIT_PATIENT_NOT_FOUND: ErrorMessage = new ErrorMessage(2002,
    "No patient found with ID (.*)",
    "error.edit_patient_not_found");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(2003,
    "Multiple patients found with the given external IDs!",
    "error.edit_patient_conflict_ext_ids_multiple_match");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS: ErrorMessage = new ErrorMessage(2004,
    "Found existing patient with matching IDAT but conflicting external ID(s).",
    "error.edit_patient_conflict_ext_ids");
  public static EDIT_PATIENT_CONFLICT_IDAT: ErrorMessage = new ErrorMessage(2005,
    "Found existing patient with matching external ID but conflicting IDAT!",
    "error.edit_patient_conflict_idat");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(2006,
    "External ID and IDAT match with different patients, respectively!",
    "error.edit_patient_conflict_ext_ids_idat_multiple_match");
  public static EDIT_PATIENT_CONFLICT_POSSIBLE_MATCH: ErrorMessage = new ErrorMessage(1007,
    "Editing patient not possible because of tentative matching with the existing patient! Use sureness flag, if you are sure the data is correct and can be edited",
    "error.edit_patient_conflict_possible_match");
  public static EDIT_PATIENT_CONFLICT_MATCH: ErrorMessage = new ErrorMessage(1008,
    "Editing patient not possible because of matching with the existing patient!",
    "error.edit_patient_conflict_match");

    ////
    // CREATE IDS ERRORS
    //---------------------
  public static CREATE_IDS_ERROR: ErrorMessage = new ErrorMessage(3001,
    "ResolveCreateIdTokenError",
  "ResolveCreateIdTokenError");
}
