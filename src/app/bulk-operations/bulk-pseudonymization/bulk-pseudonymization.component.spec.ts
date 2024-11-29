import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPseudonymizationComponent } from './bulk-pseudonymization.component';

describe('BulkPseudonymizationComponent', () => {
  let component: BulkPseudonymizationComponent;
  let fixture: ComponentFixture<BulkPseudonymizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPseudonymizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPseudonymizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
