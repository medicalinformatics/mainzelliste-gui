import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedAuthenticationComponent } from './failed-authentication.component';

describe('FailedAuthenticationComponent', () => {
  let component: FailedAuthenticationComponent;
  let fixture: ComponentFixture<FailedAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedAuthenticationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
