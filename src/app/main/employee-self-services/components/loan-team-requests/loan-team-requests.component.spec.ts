import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTeamRequestsComponent } from './loan-team-requests.component';

describe('LoanTeamRequestsComponent', () => {
  let component: LoanTeamRequestsComponent;
  let fixture: ComponentFixture<LoanTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(LoanTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
