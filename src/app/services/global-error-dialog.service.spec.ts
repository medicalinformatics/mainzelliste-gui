import { TestBed } from '@angular/core/testing';

import { GlobalErrorDialogService } from './global-error-dialog.service';

describe('GlobalErrorDialogService', () => {
  let service: GlobalErrorDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
