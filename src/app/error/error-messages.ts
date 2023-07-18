export class ErrorMessage {
  constructor(
    public id: number,
    public message: string,
    public message_de: string,
  ) {
  }
}

export class ErrorMessages {
  /* Create Patient Errors*/
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
  "");
  public static CREATE_PATIENT_CONFLICT_POSSIBLE_MATCH: ErrorMessage = new ErrorMessage(1007,
  "Unable to definitely determined whether the data refers to an existing or to a new patient. Please check data or resubmit with sureness=true to get a tentative result. Please check documentation for details.",
  "Zu den eingegeben Daten wurde ein ähnlicher Patient gefunden, der aber nicht mit hinreichender Sicherheit zugeordnet werden kann. Um eine Verwechslung auszuschließen, überprüfen Sie bitte nochmals Ihre Eingabe");
}
