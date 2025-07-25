import {DateTime, Duration} from "luxon";
import {TranslateService} from "@ngx-translate/core";

export interface ConsentValidityPeriod {
  period?: Validity,
  validFrom: DateTime,
  validUntil?: DateTime,
}

export class Validity {
  days: number = 0;
  months: number = 0;
  years: number = 0;
  duration: Duration | undefined;

  constructor(day?: number, month?: number, year?: number, duration?: Duration) {
    this.set(day, month, year, duration);
  }

  public toLocalText(translate: TranslateService) {
    return `${this.years}  ${translate.instant("consent_template.validity_years")} -
    ${this.months} ${translate.instant("consent_template.validity_months")} -
    ${this.days}  ${translate.instant("consent_template.validity_days")}`;
  }

  public set(day?: number, month?: number, year?: number, duration?: Duration) {
    this.days = day ?? 0;
    this.months = month ?? 0;
    this.years = year ?? 0;
    this.duration = duration;
  }

  public isGreaterThan(period:Validity){
    return this.years > period.years ||
      this.years == period.years && (this.months > period.months ||
        this.months == period.months && this.days > period.days)
  }

  public isEmpty(){
    return (!this.years || this.years == 0) && (!this.months || this.months == 0)
      && (!this.days || this.days == 0)
  }
}
