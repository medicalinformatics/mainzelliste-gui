import {ErrorMessage} from "../error/error-messages";

export class MainzellisteError extends Error {

  public errorMessage: ErrorMessage;
  public messageVariable;

  constructor(
    message: ErrorMessage,
    messageVariable?: string
  ) {
    super(message.message.toString());
    this.errorMessage = message;
    this.messageVariable = messageVariable
  }
}
