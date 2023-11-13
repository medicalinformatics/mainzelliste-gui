import {HttpErrorResponse} from "@angular/common/http";

export class ErrorMessage {
  constructor(
    public id: number,
    public message: string | RegExp,
    public message_de: string,
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
      return this.message_de.replace("${1}", messageVariable)
    } else
      return this.message_de
  }
}

export class ErrorMessages {

  ////
  // General ERRORS
  //-------------------
  public static ML_SESSION_NOT_FOUND: ErrorMessage = new ErrorMessage(101,
    /Session-ID (.*) unknown./i,
  "Session ist ungültig");

  ////
  // ADD PATIENT ERRORS
  //-------------------
  public static CREATE_PATIENT_MISSING_FIELD: ErrorMessage = new ErrorMessage(1001,
    "Neither complete IDAT nor an external ID has been given as input!",
    "Die Eingabe der Pflichtfelder sind erforderlich");
  public static CREATE_PATIENT_MISSING_ID_TYPE: ErrorMessage = new ErrorMessage(1002,
    "Please select an id type",
    "Die Eingabe eines Pseudonymtyp ist erforderlich");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(1003,
    "Multiple patients found with the given external IDs!",
    "Patient konnte nicht hinzugefügt werden, da die eingegebenen externen Pseudonymen bereit zu unterschiedlichen Patienten zugeordnet wurden");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS: ErrorMessage = new ErrorMessage(1004,
    "Found existing patient with matching IDAT but conflicting external ID(s).",
    "Patient konnte nicht hinzugefügt werden, da der Anhand der eingegebenen IDATs gefundenen Patient bereit abweichenden externen IDs hat.");
  public static CREATE_PATIENT_CONFLICT_IDAT: ErrorMessage = new ErrorMessage(1005,
    "Found existing patient with matching external ID but conflicting IDAT!",
    "Patient konnte nicht hinzugefügt werden, da der Anhand der eingegebenen externen ID gefundenen Patient bereit abweichende IDAT hat.");
  public static CREATE_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(1006,
  "External ID and IDAT match with different patients, respectively!",
  "Patient konnte nicht hinzugefügt werden, da die eingegebenen IDAT zu unterschiedlichen Patienten zugeordnet wurden");
  public static CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH: ErrorMessage = new ErrorMessage(1007,
  "Unable to definitely determined whether the data refers to an existing or to a new patient. Please check data or resubmit with sureness=true to get a tentative result. Please check documentation for details.",
  "Zu den eingegeben Daten wurde ein ähnlicher Patient gefunden, der aber nicht mit hinreichender Sicherheit zugeordnet werden kann. Um eine Verwechslung auszuschließen, überprüfen Sie bitte nochmals Ihre Eingabe");
  public static CREATE_PATIENT_INVALID_FIELD: ErrorMessage = new ErrorMessage(1008,
    /Field (\w+) does not conform to the required format/i,
    "IDAT-Feld '${1}' ist ungültig");
  public static CREATE_PATIENT_INVALID_EXT_ID: ErrorMessage = new ErrorMessage(1009,
    /ID (.*) is invalid for type (\w+)/i,
    "Externen ID '${1}' ist ungültig");
  public static CREATE_PATIENT_INVALID_DATE_1: ErrorMessage = new ErrorMessage(1010,
    /(.*) is not a valid date!/i,
    "Geburtsdatum ist ungültig");
  public static CREATE_PATIENT_INVALID_DATE_2: ErrorMessage = new ErrorMessage(1011,
    /(.*) is in the future!/i,
    "Geburtsdatum liegt in der Zukunft")

    ////
    // EDIT PATIENT ERRORS
    //---------------------
  public static EDIT_PATIENT_EMPTY_FIELD: ErrorMessage = new ErrorMessage(2001,
    /Field (\w+) must not be empty!/i,
  "Die Eingabe der Pflichtfeld '${1}' ist erforderlich");
  public static EDIT_PATIENT_NOT_FOUND: ErrorMessage = new ErrorMessage(2002,
    "No patient found with ID (.*)",
    "Der zu editierende Patient wurde inzwischen entfernt.");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(2003,
    "Multiple patients found with the given external IDs!",
    "Patient konnte nicht editiert werden, da die eingegebenen externen Pseudonymen bereit zu unterschiedlichen Patienten zugeordnet wurden");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS: ErrorMessage = new ErrorMessage(2004,
    "Found existing patient with matching IDAT but conflicting external ID(s).",
    "Patient konnte nicht editiert werden, da der Anhand der eingegebenen IDATs gefundenen Patient bereit abweichenden externen IDs hat.");
  public static EDIT_PATIENT_CONFLICT_IDAT: ErrorMessage = new ErrorMessage(2005,
    "Found existing patient with matching external ID but conflicting IDAT!",
    "Patient konnte nicht editiert werden, da der Anhand der eingegebenen externen ID gefundenen Patient bereit abweichende IDAT hat.");
  public static EDIT_PATIENT_CONFLICT_EXT_IDS_IDAT_MULTIPLE_MATCH: ErrorMessage = new ErrorMessage(2006,
    "External ID and IDAT match with different patients, respectively!",
    "Patient konnte nicht editiert werden, da die eingegebenen IDAT zu unterschiedlichen Patienten zugeordnet wurden");
  public static EDIT_PATIENT_CONFLICT_POSSIBLE_MATCH: ErrorMessage = new ErrorMessage(1007,
    "Editing patient not possible because of tentative matching with the existing patient! Use sureness flag, if you are sure the data is correct and can be edited",
    "Zu den eingegeben Daten wurde ein ähnlicher Patient gefunden, der aber nicht mit hinreichender Sicherheit zugeordnet werden kann. Um eine Verwechslung auszuschließen, überprüfen Sie bitte nochmals Ihre Eingabe");
  public static EDIT_PATIENT_CONFLICT_MATCH: ErrorMessage = new ErrorMessage(1008,
    "Editing patient not possible because of matching with the existing patient!",
    "Zu den eingegeben Daten wurde ein Patient gefunden. Um eine Verwechslung auszuschließen, überprüfen Sie bitte nochmals Ihre Eingabe");

    ////
    // CREATE IDS ERRORS
    //---------------------
  public static CREATE_IDS_ERROR: ErrorMessage = new ErrorMessage(3001,
    "ResolveCreateIdTokenError",
  "ResolveCreateIdTokenError");
}
