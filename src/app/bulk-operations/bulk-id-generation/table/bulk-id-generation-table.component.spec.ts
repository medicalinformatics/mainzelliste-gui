import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkIdGenerationTableComponent } from './bulk-id-generation-table.component';

describe('BulkIdGenerationTableComponent', () => {
  let component: BulkIdGenerationTableComponent;
  let fixture: ComponentFixture<BulkIdGenerationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkIdGenerationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkIdGenerationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
