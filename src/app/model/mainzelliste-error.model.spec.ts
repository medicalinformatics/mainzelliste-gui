import { MainzellisteError } from './mainzelliste-error.model';

describe('MainzellisteError', () => {
  it('should create an instance', () => {
    expect(new MainzellisteError("message")).toBeTruthy();
  });
});
