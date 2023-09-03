import { TestBed } from '@angular/core/testing';

import { GlobalTitleService } from './global-title.service';

describe('GlobalTitleService', () => {
  let service: GlobalTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
