import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentativeMatchesListComponent } from './tentative-matches-list.component';

describe('TentativeMatchesListComponent', () => {
  let component: TentativeMatchesListComponent;
  let fixture: ComponentFixture<TentativeMatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TentativeMatchesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TentativeMatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
