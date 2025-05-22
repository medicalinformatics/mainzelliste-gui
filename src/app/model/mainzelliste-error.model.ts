import {ErrorMessage} from "../error/error-messages";

export class MainzellisteError extends Error {

  public errorMessage: ErrorMessage;
  public messageVariables: string[];

  constructor(
    message: ErrorMessage,
    ...messageVariables: string[]
  ) {
    super(message.message.toString());
    this.errorMessage = message;
    this.messageVariables = messageVariables
  }
}
