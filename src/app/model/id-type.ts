import {Operation} from "./tenant";

export interface IdType {
  name: string
  isExternal: boolean
  isAssociated: boolean
  permissions?: Operation[]
}
