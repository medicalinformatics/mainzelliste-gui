import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAssociatedIdsComponent } from './patient-associated-ids.component';

describe('PatientAssociatedIdsComponent', () => {
  let component: PatientAssociatedIdsComponent;
  let fixture: ComponentFixture<PatientAssociatedIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAssociatedIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAssociatedIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
