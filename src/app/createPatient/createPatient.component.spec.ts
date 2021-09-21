import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientFormularComponent } from './createPatient.component';

describe('AddPatientFormularComponent', () => {
  let component: AddPatientFormularComponent;
  let fixture: ComponentFixture<AddPatientFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientFormularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
