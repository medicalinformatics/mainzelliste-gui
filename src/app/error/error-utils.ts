import { TranslateService } from "@ngx-translate/core";
import {MainzellisteError} from "../model/mainzelliste-error.model";

export function getErrorMessageFrom(error: any, translate: TranslateService) : string {
  //unwrapping uncaught promise rejection
  if(error.promise && error.rejection){
    error = error.rejection;
  }
  if(error instanceof MainzellisteError)
    return error.errorMessage.getMessage(translate, error.messageVariable);
  else
    return error?.message || translate.instant('error.get_error_message_from_undefined_error');
}
