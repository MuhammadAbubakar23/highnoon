import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTeamRequestsComponent } from './attendance-team-requests.component';

describe('AttendanceTeamRequestsComponent', () => {
  let component: AttendanceTeamRequestsComponent;
  let fixture: ComponentFixture<AttendanceTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(AttendanceTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
