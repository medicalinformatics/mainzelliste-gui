import { TestBed } from '@angular/core/testing';

import { AdventureTimeService } from './adventure-time.service';

describe('AdventureTimeService', () => {
  let service: AdventureTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdventureTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
