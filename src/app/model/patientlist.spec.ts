import { PatientList } from './patientlist';

describe('Patientlist', () => {
  it('should create an instance', () => {
    expect(new PatientList(new URL('http://localhost'), 'justATestApiKey')).toBeTruthy();
  });

  it('should parse from json', () => {
    const configJson: string = '{"url": "http://localhost:8080", "apiKey": "thisIsAnApiKey"}';
    expect(JSON.parse(configJson)).toBe(PatientList)
  })
});
