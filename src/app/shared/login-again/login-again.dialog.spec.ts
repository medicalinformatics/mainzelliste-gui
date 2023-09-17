import { ComponentFixture, TestBed } from '@angular/core/testing';
import {LoginAgainDialog} from "./login-again.dialog";

describe('LoginAgainComponent', () => {
  let component: LoginAgainDialog;
  let fixture: ComponentFixture<LoginAgainDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAgainDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAgainDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
