import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentFundTeamRequestsComponent } from './provident-fund-team-requests.component';

describe('ProvidentFundTeamRequestsComponent', () => {
  let component: ProvidentFundTeamRequestsComponent;
  let fixture: ComponentFixture<ProvidentFundTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidentFundTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(ProvidentFundTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
