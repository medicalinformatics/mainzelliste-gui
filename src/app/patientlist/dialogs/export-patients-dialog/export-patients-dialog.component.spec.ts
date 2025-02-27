import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPatientsDialogComponent } from './export-patients-dialog.component';

describe('ExportPatientsDialogComponent', () => {
  let component: ExportPatientsDialogComponent;
  let fixture: ComponentFixture<ExportPatientsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPatientsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPatientsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
