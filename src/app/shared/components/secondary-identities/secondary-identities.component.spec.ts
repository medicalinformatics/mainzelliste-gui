import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryIdentitiesComponent } from './secondary-identities.component';

describe('SecondaryIdentitiesComponent', () => {
  let component: SecondaryIdentitiesComponent;
  let fixture: ComponentFixture<SecondaryIdentitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryIdentitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
