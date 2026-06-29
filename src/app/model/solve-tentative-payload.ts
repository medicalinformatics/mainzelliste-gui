import {Id} from "./id";

export interface SolveTentativePayload {
  operation: SolveTentativeOperationType,
  main?: Id,
  force: boolean
}

export enum SolveTentativeOperationType {
  split = "split",
  merge = "merge"
}
