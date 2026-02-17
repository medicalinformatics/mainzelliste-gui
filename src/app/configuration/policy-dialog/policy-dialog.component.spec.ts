import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDialogComponent } from './policy-dialog.component';

describe('PolicyDialogComponent', () => {
  let component: PolicyDialogComponent;
  let fixture: ComponentFixture<PolicyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PolicyDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PolicyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
