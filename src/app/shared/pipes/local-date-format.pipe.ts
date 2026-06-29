import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from "luxon";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'localDateFormat',
  standalone: true,
  pure: false,
})
export class LocalDateFormatPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }

  transform(dateTime: DateTime, extended?: boolean): string {
    return dateTime?.setLocale(this.translate.getCurrentLang())
    .toLocaleString(extended ? DateTime.DATETIME_SHORT_WITH_SECONDS : DateTime.DATE_SHORT) ?? "";
  }
}
