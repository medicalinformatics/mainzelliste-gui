import { PatientList } from './patientlist';

describe('Patientlist', () => {
  it('should create an instance', () => {
    expect(new PatientList(new URL('http://localhost'))).toBeTruthy();
  });

  it('should parse from json', () => {
    const configJson: string = '{"url": "http://localhost:8080"}';
    expect(JSON.parse(configJson)).toBe(PatientList)
  })
});
