import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestSummaryComponent } from './team-request-summary.component';

describe('TeamRequestSummaryComponent', () => {
  let component: TeamRequestSummaryComponent;
  let fixture: ComponentFixture<TeamRequestSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamRequestSummaryComponent]
    });
    fixture = TestBed.createComponent(TeamRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
