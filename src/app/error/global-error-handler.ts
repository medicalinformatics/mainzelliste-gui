import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {GlobalErrorDialogService} from "../services/global-error-dialog.service";
import {ErrorNotificationService} from "../services/error-notification.service";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {getErrorMessageFrom} from "./error-utils";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private translate: TranslateService,
    private zone: NgZone,
    private errorDialogService: GlobalErrorDialogService,
    private errorNotificationService: ErrorNotificationService
  ) {}

  handleError(error: any): void {
    console.log("Global Error Handler: ", error)
    //unwrapping uncaught promise rejection
    if(error.promise && error.rejection){
      error = error.rejection;
    }
    if(error instanceof MainzellisteError) {
      this.errorNotificationService.addMessage(error.errorMessage.getMessage(this.translate, error.messageVariable));
    } else {
      this.zone.run(() =>
        this.errorDialogService.openDialog(error?.message || this.translate.instant('error.get_error_message_from_undefined_error'))
      );
    }
  }
}
