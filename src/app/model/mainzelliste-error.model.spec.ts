import { MainzellisteError } from './mainzelliste-error.model';
import {ErrorMessages} from "../error/error-messages";

describe('MainzellisteError', () => {
  it('should create an instance', () => {
    expect(new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND)).toBeTruthy();
  });
});
