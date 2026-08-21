import {Patient} from "./patient";

export interface PatientMatchesResult {
  totalCount: number;
  patients: PatientMatchResult[];
}

export interface PatientMatchResult {
  type: PatientMatchType;
  score: number;
  patient: Patient;
}

export enum PatientMatchType { MATCH = "MATCH", NO_MATCH = "NO_MATCH"}
