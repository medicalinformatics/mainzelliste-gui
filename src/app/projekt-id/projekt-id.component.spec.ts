import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjektIdComponent } from './projekt-id.component';

describe('ProjektIdComponent', () => {
  let component: ProjektIdComponent;
  let fixture: ComponentFixture<ProjektIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjektIdComponent]
    });
    fixture = TestBed.createComponent(ProjektIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
