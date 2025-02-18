export class TokenData {
  constructor(
    public callback?: URL,
    public redirect?: URL,
    public patientId?: any,
  ) { }
}

/* example patientId:
      "patientId": {
        "idType": this.idType,
        "idString": this.idString
      }
*/