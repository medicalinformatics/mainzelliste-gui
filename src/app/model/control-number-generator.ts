export class ControlNumberGenerator {
  constructor(
    public url: URL,
    // This needs permission to request controlNumbers
    public apiKey: string
  ) {
  }
}
