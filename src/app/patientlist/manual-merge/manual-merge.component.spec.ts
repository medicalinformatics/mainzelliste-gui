import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualMergeComponent } from './manual-merge.component';

describe('ManualMergeComponent', () => {
  let component: ManualMergeComponent;
  let fixture: ComponentFixture<ManualMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualMergeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
