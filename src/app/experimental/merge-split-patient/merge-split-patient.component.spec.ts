import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeSplitPatientComponent } from './merge-split-patient.component';

describe('MergeSplitPatientComponent', () => {
  let component: MergeSplitPatientComponent;
  let fixture: ComponentFixture<MergeSplitPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeSplitPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeSplitPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
