import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAssociatedIdsTableComponent } from './patient-associated-ids-table.component';

describe('PatientAssociatedIdsComponent', () => {
  let component: PatientAssociatedIdsTableComponent;
  let fixture: ComponentFixture<PatientAssociatedIdsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAssociatedIdsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAssociatedIdsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
