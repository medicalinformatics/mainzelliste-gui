import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {GlobalErrorDialogService} from "../services/global-error-dialog.service";
import {ErrorNotificationService} from "../services/error-notification.service";
import {MainzellisteError} from "../model/mainzelliste-error.model";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private zone: NgZone,
    private errorDialogService: GlobalErrorDialogService,
    private errorNotificationService: ErrorNotificationService
  ) {
  }

  handleError(error: any): void {
    console.log("Global Error Handler: ", error)
    let errorMessage = error?.message || 'Undefined client error';
    if(error instanceof MainzellisteError) {
      this.errorNotificationService.addMessage(errorMessage)
    } else {
      this.zone.run(() =>
        this.errorDialogService.openDialog(errorMessage)
      );
    }
  }
}
