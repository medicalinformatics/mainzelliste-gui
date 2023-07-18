import {ErrorMessage} from "../error/error-messages";

export class MainzellisteError extends Error {

  public errorMessage: ErrorMessage;
  public clean: boolean = false

  constructor(
    message: ErrorMessage,
    clean?: boolean
  ) {
    super(message.message);
    this.errorMessage = message;
    this.clean = clean != undefined && clean;
  }

  public static createFrom(error: Error, clean:boolean): Error {
    if(error instanceof MainzellisteError){
      return new MainzellisteError(error.errorMessage, clean);
    }
    return error;
  }
}
