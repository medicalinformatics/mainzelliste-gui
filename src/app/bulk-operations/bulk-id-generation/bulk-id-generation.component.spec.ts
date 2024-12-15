import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkIdGenerationComponent } from './bulk-id-generation.component';

describe('BulkIdGenerationComponent', () => {
  let component: BulkIdGenerationComponent;
  let fixture: ComponentFixture<BulkIdGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkIdGenerationComponent]
    });
    fixture = TestBed.createComponent(BulkIdGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
