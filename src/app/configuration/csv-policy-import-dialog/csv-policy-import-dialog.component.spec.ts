import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvPolicyImportDialogComponent } from './csv-policy-import-dialog.component';

describe('CsvPolicyImportDialogComponent', () => {
  let component: CsvPolicyImportDialogComponent;
  let fixture: ComponentFixture<CsvPolicyImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CsvPolicyImportDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CsvPolicyImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
