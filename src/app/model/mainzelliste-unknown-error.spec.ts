import { MainzellisteUnknownError } from './mainzelliste-unknown-error';

describe('MainzellisteUnknownError', () => {
  it('should create an instance', () => {
    expect(new MainzellisteUnknownError("failed", new Error("fatal"))).toBeTruthy();
  });
});
