import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErgebnisZusammenfuehrenComponent } from './ergebnis-zusammenfuehren.component';

describe('ErgebnisZusammenfuehrenComponent', () => {
  let component: ErgebnisZusammenfuehrenComponent;
  let fixture: ComponentFixture<ErgebnisZusammenfuehrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErgebnisZusammenfuehrenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErgebnisZusammenfuehrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
