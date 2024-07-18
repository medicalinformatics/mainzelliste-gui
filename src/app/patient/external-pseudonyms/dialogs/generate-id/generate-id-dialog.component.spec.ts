import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIdDialog } from './generate-id-dialog.component';

describe('GenerateIdDialogComponent', () => {
  let component: GenerateIdDialog;
  let fixture: ComponentFixture<GenerateIdDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateIdDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateIdDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
