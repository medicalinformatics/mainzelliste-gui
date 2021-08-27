import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientenZeileComponent } from './edit-patienten-zeile.component';

describe('EditPatientenZeileComponent', () => {
  let component: EditPatientenZeileComponent;
  let fixture: ComponentFixture<EditPatientenZeileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPatientenZeileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientenZeileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
