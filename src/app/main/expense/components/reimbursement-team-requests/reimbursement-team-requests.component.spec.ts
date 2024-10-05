import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementTeamRequestsComponent } from './reimbursement-team-requests.component';

describe('ReimbursementTeamRequestsComponent', () => {
  let component: ReimbursementTeamRequestsComponent;
  let fixture: ComponentFixture<ReimbursementTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReimbursementTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(ReimbursementTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
