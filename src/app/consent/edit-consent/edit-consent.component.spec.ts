import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsentComponent } from './edit-consent.component';

describe('EditConsentComponent', () => {
  let component: EditConsentComponent;
  let fixture: ComponentFixture<EditConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
