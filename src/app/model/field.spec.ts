import {Field, FieldType} from './field';

describe('Field', () => {
  it('should create an instance', () => {
    expect(new Field("Vorname", "Vorname", [], FieldType.TEXT, true, "", "Max")).toBeTruthy();
  });
});
