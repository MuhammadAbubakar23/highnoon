import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAttendanceComponent } from './self-attendance.component';

describe('SelfAttendanceComponent', () => {
  let component: SelfAttendanceComponent;
  let fixture: ComponentFixture<SelfAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelfAttendanceComponent]
    });
    fixture = TestBed.createComponent(SelfAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
