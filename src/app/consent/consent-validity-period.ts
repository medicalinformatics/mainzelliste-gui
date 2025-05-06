import {DateTime} from "luxon";
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

  constructor(day?: number, month?: number, year?: number) {
    this.days = day ?? 0;
    this.months = month ?? 0;
    this.years = year ?? 0;
  }

  public toLocalText(translate: TranslateService) {
    return `${this.years}  ${translate.instant("consent_template.validity_years")} -
    ${this.months} ${translate.instant("consent_template.validity_months")} -
    ${this.days}  ${translate.instant("consent_template.validity_days")}`;
  }
}
