import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentDetailComponent } from './consent-detail.component';

describe('ConsentDetailComponent', () => {
  let component: ConsentDetailComponent;
  let fixture: ComponentFixture<ConsentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
