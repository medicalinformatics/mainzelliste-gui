import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationsseiteComponent } from './navigation.component';

describe('NavigationsseiteComponent', () => {
  let component: NavigationsseiteComponent;
  let fixture: ComponentFixture<NavigationsseiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationsseiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationsseiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
