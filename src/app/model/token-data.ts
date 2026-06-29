import { Id } from "./id";

export class TokenData {
  constructor(
    public callback?: URL,
    public redirect?: URL,
    public patientId?: Id,
  ) { }
}