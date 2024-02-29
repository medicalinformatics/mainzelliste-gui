import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedIdsDialog } from './associated-ids-dialog';

describe('AssociatedIdsDialog', () => {
  let component: AssociatedIdsDialog;
  let fixture: ComponentFixture<AssociatedIdsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociatedIdsDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedIdsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
