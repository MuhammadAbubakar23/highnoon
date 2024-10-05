import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAttendanceComponent } from './team-attendance.component';

describe('TeamAttendanceComponent', () => {
  let component: TeamAttendanceComponent;
  let fixture: ComponentFixture<TeamAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamAttendanceComponent]
    });
    fixture = TestBed.createComponent(TeamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
