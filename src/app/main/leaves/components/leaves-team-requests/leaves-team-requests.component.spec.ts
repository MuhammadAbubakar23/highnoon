import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesTeamRequestsComponent } from './leaves-team-requests.component';

describe('LeavesTeamRequestsComponent', () => {
  let component: LeavesTeamRequestsComponent;
  let fixture: ComponentFixture<LeavesTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(LeavesTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
