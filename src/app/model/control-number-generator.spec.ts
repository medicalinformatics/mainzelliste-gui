import { ControlNumberGenerator } from './control-number-generator';

describe('ControlNumberGenerator', () => {
  it('should create an instance', () => {
    expect(new ControlNumberGenerator(new URL("www.dkfz.de"),"APIKEY")).toBeTruthy();
  });
});
