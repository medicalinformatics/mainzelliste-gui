import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPseudonymsComponent } from './patient-pseudonyms.component';

describe('PatientPseudonymsComponent', () => {
  let component: PatientPseudonymsComponent;
  let fixture: ComponentFixture<PatientPseudonymsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PatientPseudonymsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPseudonymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
