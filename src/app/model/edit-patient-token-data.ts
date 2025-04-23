import { Id } from "./id";
import {TokenData} from "./token-data";

export class EditPatientTokenData extends TokenData {
  constructor(
    public patientId: Id,
    public fields: string[],
    public ids: string[],
    public callback?: URL,
    public redirect?: URL
  ) {
    super(callback, redirect)
  }
}
