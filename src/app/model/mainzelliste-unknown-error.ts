import {getErrorMessageFrom} from "../error/error-utils";

export class MainzellisteUnknownError extends Error {
  constructor(
    errorMessage: string,
    cause: Error
  ) {
    super(`${errorMessage}. Cause: ${getErrorMessageFrom(cause)}`)
  }
}
