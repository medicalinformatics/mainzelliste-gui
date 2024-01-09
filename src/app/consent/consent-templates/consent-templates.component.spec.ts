import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentTemplatesComponent } from './consent-templates.component';

describe('ConsentTemplatesComponent', () => {
  let component: ConsentTemplatesComponent;
  let fixture: ComponentFixture<ConsentTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
