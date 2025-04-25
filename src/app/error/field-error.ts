import {TranslateService} from "@ngx-translate/core";

export class FieldError extends Error{
  constructor(
    public translate: TranslateService,
    public i18n: string,
    public variable?: string
  ) {
    super(variable != undefined && variable.length > 0 ?
      translate.instant(i18n).replace("${}", variable):translate.instant(i18n)
    )
  }
}
