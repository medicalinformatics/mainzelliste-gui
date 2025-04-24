import {DateTime} from "luxon";

export interface ConsentValidityPeriod {
  period?: Validity,
  validFrom: DateTime,
  validUntil?: DateTime,
}

export interface Validity {
  day: number,
  month: number,
  year: number
}
