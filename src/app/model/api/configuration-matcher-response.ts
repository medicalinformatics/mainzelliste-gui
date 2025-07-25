import {ClaimPermissions} from "./configuration-claims-data";

export interface ConfigurationMatcherResponse {
  name: string,
  thresholdMatch: number,
  thresholdNonMatch: number,
}
