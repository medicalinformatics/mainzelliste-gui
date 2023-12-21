import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentTemplateDialogComponent } from './consent-template-dialog.component';

describe('ConsentTemplateDialogComponent', () => {
  let component: ConsentTemplateDialogComponent;
  let fixture: ComponentFixture<ConsentTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentTemplateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
