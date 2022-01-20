import { DeletePatientTokenData } from './delete-patient-token-data';

describe('DeletePatientTokenData', () => {
  it('should create an instance', () => {
    expect(new DeletePatientTokenData({idType: "PID", idString: "12345678"})).toBeTruthy();
  });
});
