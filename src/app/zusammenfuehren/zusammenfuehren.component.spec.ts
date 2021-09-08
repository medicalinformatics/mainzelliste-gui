import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZusammenfuehrenComponent } from './zusammenfuehren.component';

describe('ZusammenfuehrenComponent', () => {
  let component: ZusammenfuehrenComponent;
  let fixture: ComponentFixture<ZusammenfuehrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZusammenfuehrenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZusammenfuehrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
