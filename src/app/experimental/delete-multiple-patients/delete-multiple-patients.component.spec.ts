import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMultiplePatientsComponent } from './delete-multiple-patients.component';

describe('DeleteMultiplePatientsComponent', () => {
  let component: DeleteMultiplePatientsComponent;
  let fixture: ComponentFixture<DeleteMultiplePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMultiplePatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMultiplePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
