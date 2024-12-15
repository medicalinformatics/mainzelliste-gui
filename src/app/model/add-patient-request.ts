export class AddPatientRequest {
  constructor(
    public fields: { [key: string]: string } = {},
    public ids: { [key: string]: string } = {},
    public sureness: boolean = false
  ) {
  }
}
