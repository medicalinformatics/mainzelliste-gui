import { TranslateService } from "@ngx-translate/core";
import {getErrorMessageFrom} from "../error/error-utils";

export class MainzellisteUnknownError extends Error {
  constructor(
    errorMessage: string,
    cause: Error,
    translate: TranslateService
  ) {
    super(`${errorMessage}` + translate.instant('error.mainzelliste_unknown_error') + `${getErrorMessageFrom(cause, translate)}`)
  }
}
