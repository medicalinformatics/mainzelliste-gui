import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalPseudonymsComponent } from './external-pseudonyms.component';

describe('ExternalPseudonymsComponent', () => {
  let component: ExternalPseudonymsComponent;
  let fixture: ComponentFixture<ExternalPseudonymsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalPseudonymsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalPseudonymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
