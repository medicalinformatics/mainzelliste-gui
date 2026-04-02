import { TestBed } from '@angular/core/testing';

import { MlTokenAuthService } from './ml-token-auth.service';

describe('MlTokenAuthService', () => {
  let service: MlTokenAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MlTokenAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
