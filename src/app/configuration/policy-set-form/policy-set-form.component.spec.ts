import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySetFormComponent } from './policy-set-form.component';

describe('PolicySetFormComponent', () => {
  let component: PolicySetFormComponent;
  let fixture: ComponentFixture<PolicySetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicySetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicySetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
