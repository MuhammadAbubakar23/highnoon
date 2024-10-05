import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOvertimeComponent } from './team-overtime.component';

describe('TeamOvertimeComponent', () => {
  let component: TeamOvertimeComponent;
  let fixture: ComponentFixture<TeamOvertimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamOvertimeComponent]
    });
    fixture = TestBed.createComponent(TeamOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
