import {Id} from "./id";

export class AddPatientsSingleResponse {
  constructor(
    public ids: Id[] = [],
    public error?: string
  ) {
  }
}
