import {DateTime} from "luxon";

export class StringUtils {
  static isEmpty(str: string | undefined) {
    return !str || str.trim().length == 0;
  }

  static convertDateFromISOToLocale(date: string | undefined, locale: string, leadingZero?:boolean){
    return this.convertDateToLocale(this.parseISODate(date), locale, leadingZero);
  }

  static convertDateToLocale(dateTime: Date | undefined, locale: string, leadingZero?:boolean){
    if(!dateTime)
      return ""
    else if (locale && leadingZero)
      return dateTime.toLocaleDateString(locale, {year: "numeric", month: "2-digit", day: "2-digit"})
    else
      return dateTime.toLocaleDateString()
  }

  static parseISODate(date: string | undefined) {
    const dateTime = DateTime.fromISO(date?.trim() ?? "");
    return dateTime.isValid ? dateTime.toJSDate() : undefined;
  }
}
