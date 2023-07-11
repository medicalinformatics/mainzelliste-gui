import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalErrorDialogService} from "../services/global-error-dialog.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private zone: NgZone,
    private errorDialogService: GlobalErrorDialogService,
  ) {
  }

  handleError(error: any): void {
    console.log("Global Error Handler: ", error)
    this.zone.run(() =>
        this.errorDialogService.openDialog(error?.message || 'Undefined client error')
    );
  }
}
