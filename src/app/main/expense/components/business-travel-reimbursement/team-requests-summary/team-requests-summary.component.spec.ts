import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestsSummaryComponent } from './team-requests-summary.component';

describe('TeamRequestsSummaryComponent', () => {
  let component: TeamRequestsSummaryComponent;
  let fixture: ComponentFixture<TeamRequestsSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamRequestsSummaryComponent]
    });
    fixture = TestBed.createComponent(TeamRequestsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
