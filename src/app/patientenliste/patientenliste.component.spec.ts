import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientenlisteComponent } from './patientenliste.component';

describe('PatientenlisteComponent', () => {
  let component: PatientenlisteComponent;
  let fixture: ComponentFixture<PatientenlisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientenlisteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientenlisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
