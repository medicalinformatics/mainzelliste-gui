import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientenzeileComponent } from './patientrow.component';

describe('PatientenzeileComponent', () => {
  let component: PatientenzeileComponent;
  let fixture: ComponentFixture<PatientenzeileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientenzeileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientenzeileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
