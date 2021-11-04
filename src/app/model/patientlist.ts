import {ControlNumberGenerator} from "./control-number-generator";

export class PatientList {
  constructor(
    public url: URL,
    // this needs permission to read the configuration
    public apiKey: string,
    public controlNumberGenerator?: ControlNumberGenerator
  ) {
  }
}
