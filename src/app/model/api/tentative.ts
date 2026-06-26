import {Id} from "../id";

export interface Tentative {
  requestId:string,
  timestamp:string,
  matchingWeight: number,
  assignedPatient: TentativePatient,
  bestMatchPatient: TentativePatient
}

export interface TentativePatient {
  fields: { [key: string]: string },
  id: Id
}

