import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactAssociatedIdsDialog } from './compact-associated-ids-dialog';

describe('CompactAssociatedIdsDialog', () => {
  let component: CompactAssociatedIdsDialog;
  let fixture: ComponentFixture<CompactAssociatedIdsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompactAssociatedIdsDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactAssociatedIdsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
