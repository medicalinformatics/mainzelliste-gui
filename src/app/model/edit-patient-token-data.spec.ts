import { EditPatientTokenData } from './edit-patient-token-data';

describe('EditPatientTokenData', () => {
  it('should create an instance', () => {
    expect(new EditPatientTokenData(
      {idType: "pid", idString: "VFJ33YL"},
      ["name", "lastname"], ["pid"])).toBeTruthy();
  });
});
