import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPatientComponent } from './similarPatient.component';

describe('CloneComponent', () => {
  let component: SimilarPatientComponent;
  let fixture: ComponentFixture<SimilarPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
