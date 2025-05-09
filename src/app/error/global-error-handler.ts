import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {GlobalErrorDialogService} from "../services/global-error-dialog.service";
import {ErrorNotificationService} from "../services/error-notification.service";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {getErrorMessageFrom} from "./error-utils";
import { TranslateService } from '@ngx-translate/core';
import {CardError} from "./card-error";

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
    let message: string = getErrorMessageFrom(error, this.translate);
    if(error instanceof MainzellisteError || error instanceof CardError) {
      this.errorNotificationService.addMessage(message);
    } else {
      this.zone.run(() => this.errorDialogService.openDialog(message));
    }
  }
}
