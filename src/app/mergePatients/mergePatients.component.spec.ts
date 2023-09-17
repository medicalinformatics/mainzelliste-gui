import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MergePatientsComponent} from "./mergePatients.component";

describe('MergePatientsComponent', () => {
  let component: MergePatientsComponent;
  let fixture: ComponentFixture<MergePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergePatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
