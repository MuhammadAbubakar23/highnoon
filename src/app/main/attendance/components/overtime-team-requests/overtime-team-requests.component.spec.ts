import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeTeamRequestsComponent } from './overtime-team-requests.component';

describe('OvertimeTeamRequestsComponent', () => {
  let component: OvertimeTeamRequestsComponent;
  let fixture: ComponentFixture<OvertimeTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(OvertimeTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
