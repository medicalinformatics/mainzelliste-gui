import { Id } from "./id";
import {TokenData} from "./token-data";

export class DeletePatientTokenData extends TokenData{
  constructor(
    public patientId: Id,
    public callback?: URL,
    public redirect?: URL
) {
  super(callback, redirect)
  }
}
