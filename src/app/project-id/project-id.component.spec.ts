import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIdComponent } from './project-id.component';

describe('ProjectIdComponent', () => {
  let component: ProjectIdComponent;
  let fixture: ComponentFixture<ProjectIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectIdComponent]
    });
    fixture = TestBed.createComponent(ProjectIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
