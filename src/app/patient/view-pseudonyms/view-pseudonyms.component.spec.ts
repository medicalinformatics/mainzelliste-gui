import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPseudonymsComponent } from './view-pseudonyms.component';

describe('ViewPseudonymsComponent', () => {
  let component: ViewPseudonymsComponent;
  let fixture: ComponentFixture<ViewPseudonymsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPseudonymsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPseudonymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
