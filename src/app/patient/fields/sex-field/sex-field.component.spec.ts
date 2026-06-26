import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SexFieldComponent } from './sex-field.component';

describe('SexFieldComponent', () => {
  let component: SexFieldComponent;
  let fixture: ComponentFixture<SexFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SexFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SexFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
