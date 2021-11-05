import { TestBed } from '@angular/core/testing';

import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ApiKeyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
