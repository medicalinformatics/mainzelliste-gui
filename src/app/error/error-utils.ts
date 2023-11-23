import { TranslateService } from "@ngx-translate/core";

export function getErrorMessageFrom(error: any, translate: TranslateService) : string {
  //unwrapping uncaught promise rejection
  if(error.promise && error.rejection){
    error = error.rejection;
  }
  return error?.message || translate.instant('error.get_error_message_from_undefined_error');
}
