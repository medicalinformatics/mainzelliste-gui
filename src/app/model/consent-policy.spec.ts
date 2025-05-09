import { ConsentPolicy } from './consent-policy';

describe('ConsentPolicy', () => {
  it('should create an instance', () => {
    expect(new ConsentPolicy("code", "policy")).toBeTruthy();
  });
});
