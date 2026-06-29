import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveTentativeMatchComponent } from './solve-tentative-match.component';

describe('MergeSplitPatientComponent', () => {
  let component: SolveTentativeMatchComponent;
  let fixture: ComponentFixture<SolveTentativeMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolveTentativeMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolveTentativeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
