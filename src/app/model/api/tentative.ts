import {Id} from "../id";

export interface Tentative {
  requestId:string,
  timestamp:string,
  assignedPatient: Id,
  bestMatchPatient: Id
}
