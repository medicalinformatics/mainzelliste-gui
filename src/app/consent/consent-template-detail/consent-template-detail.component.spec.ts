import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentTemplateDetailComponent } from './consent-template-detail.component';

describe('ConsentTemplateDetailComponent', () => {
  let component: ConsentTemplateDetailComponent;
  let fixture: ComponentFixture<ConsentTemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentTemplateDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
