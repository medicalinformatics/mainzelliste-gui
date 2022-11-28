import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsentComponent } from './add-consent.component';

describe('AddConsentComponent', () => {
  let component: AddConsentComponent;
  let fixture: ComponentFixture<AddConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
