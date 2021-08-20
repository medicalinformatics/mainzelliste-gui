import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudittrailComponent } from './audittrail.component';

describe('AudittrailComponent', () => {
  let component: AudittrailComponent;
  let fixture: ComponentFixture<AudittrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudittrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudittrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
