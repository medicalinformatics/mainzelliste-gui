import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAngelegtComponent } from './patient-angelegt.component';

describe('PatientAngelegtComponent', () => {
  let component: PatientAngelegtComponent;
  let fixture: ComponentFixture<PatientAngelegtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAngelegtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAngelegtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
