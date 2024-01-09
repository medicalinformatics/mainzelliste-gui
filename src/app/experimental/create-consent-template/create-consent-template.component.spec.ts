import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsentTemplateComponent } from './create-consent-template.component';

describe('CreateConsentTemplateComponent', () => {
  let component: CreateConsentTemplateComponent;
  let fixture: ComponentFixture<CreateConsentTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConsentTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConsentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
