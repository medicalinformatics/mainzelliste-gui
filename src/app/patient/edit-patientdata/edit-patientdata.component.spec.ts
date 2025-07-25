import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientdataComponent } from './edit-patientdata.component';

describe('EditPatientdataComponent', () => {
  let component: EditPatientdataComponent;
  let fixture: ComponentFixture<EditPatientdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPatientdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
