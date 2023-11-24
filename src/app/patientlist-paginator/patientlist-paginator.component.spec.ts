import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientlistPaginatorComponent } from './patientlist-paginator.component';

describe('PaginatorIntlComponent', () => {
  let component: PatientlistPaginatorComponent;
  let fixture: ComponentFixture<PatientlistPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientlistPaginatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientlistPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
