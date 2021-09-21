import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientlistViewComponent } from './patientlist-view.component';

describe('PatientlistViewComponent', () => {
  let component: PatientlistViewComponent;
  let fixture: ComponentFixture<PatientlistViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientlistViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientlistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
