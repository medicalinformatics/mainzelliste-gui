import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentDialogComponent } from './consent-dialog.component';

describe('ConsentDialogComponent', () => {
  let component: ConsentDialogComponent;
  let fixture: ComponentFixture<ConsentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConsentDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
