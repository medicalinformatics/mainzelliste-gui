import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRelatedIdDialog } from './show-related-id-dialog.component';

describe('ShowRelatedIdDialogComponent', () => {
  let component: ShowRelatedIdDialog;
  let fixture: ComponentFixture<ShowRelatedIdDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRelatedIdDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRelatedIdDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
