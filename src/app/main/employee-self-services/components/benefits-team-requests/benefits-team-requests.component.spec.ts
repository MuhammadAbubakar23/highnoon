import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsTeamRequestsComponent } from './benefits-team-requests.component';

describe('BenefitsTeamRequestsComponent', () => {
  let component: BenefitsTeamRequestsComponent;
  let fixture: ComponentFixture<BenefitsTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BenefitsTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(BenefitsTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
